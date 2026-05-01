import { ConfigService } from '@nestjs/config';

export const DEFAULT_JWT_SECRET = 'paynest-dev-secret-change-in-production';

const MIN_PRODUCTION_JWT_SECRET_LENGTH = 32;

const DEFAULT_PASSWORDS = {
  ADMIN_PASSWORD: 'admin123',
  OPERATOR_PASSWORD: 'operator123',
  VIEWER_PASSWORD: 'viewer123',
} as const;

const KNOWN_DEMO_JWT_SECRETS = new Set([
  DEFAULT_JWT_SECRET,
  'test-secret',
  'change-me-to-a-random-64-char-string',
]);

const KNOWN_DEMO_PASSWORDS = new Set([
  ...Object.values(DEFAULT_PASSWORDS),
  'password',
  'password123',
  'changeme',
  'change-me',
]);

const DEFAULT_LIKE_PATTERNS = [
  /^change[-_ ]?me/i,
  /^your[-_ ]/i,
  /^example/i,
  /^demo/i,
  /^test[-_ ]?/i,
];

const warnedDefaults = new Set<string>();

type PasswordEnvKey = keyof typeof DEFAULT_PASSWORDS;

interface PasswordConfig {
  key: PasswordEnvKey;
  label: keyof AuthPasswords;
}

export interface AuthPasswords {
  admin: string;
  operator: string;
  viewer: string;
}

const PASSWORD_CONFIGS: readonly PasswordConfig[] = [
  { key: 'ADMIN_PASSWORD', label: 'admin' },
  { key: 'OPERATOR_PASSWORD', label: 'operator' },
  { key: 'VIEWER_PASSWORD', label: 'viewer' },
];

export function getValidatedJwtSecret(configService: ConfigService): string {
  const production = isProduction(configService);
  const rawSecret = readOptionalString(configService, 'JWT_SECRET');

  if (isMissing(rawSecret)) {
    if (production) {
      throw new Error('JWT_SECRET is required in production. Set a unique random value of at least 32 characters.');
    }
    warnDefaultOnce('JWT_SECRET', 'JWT_SECRET is not set; using the development JWT secret. Do not use this outside local development.');
    return DEFAULT_JWT_SECRET;
  }

  const secret = rawSecret.trim();
  const issue = getJwtSecretIssue(secret);
  if (production && issue) {
    throw new Error(`JWT_SECRET is insecure in production: ${issue}. Set a unique random value of at least 32 characters.`);
  }

  if (!production && issue) {
    warnDefaultOnce('JWT_SECRET', `JWT_SECRET ${issue}; this is acceptable only for local development.`);
  }

  return secret;
}

export function getValidatedAuthPasswords(configService: ConfigService): AuthPasswords {
  const production = isProduction(configService);
  const passwords: AuthPasswords = {
    admin: '',
    operator: '',
    viewer: '',
  };

  for (const passwordConfig of PASSWORD_CONFIGS) {
    passwords[passwordConfig.label] = getValidatedPassword(configService, passwordConfig, production);
  }

  return passwords;
}

function getValidatedPassword(configService: ConfigService, passwordConfig: PasswordConfig, production: boolean): string {
  const rawPassword = readOptionalString(configService, passwordConfig.key);

  if (isMissing(rawPassword)) {
    if (production) {
      throw new Error(`${passwordConfig.key} is required in production. Set a unique non-default password for the ${passwordConfig.label} user.`);
    }
    warnDefaultOnce(passwordConfig.key, `${passwordConfig.key} is not set; using the development ${passwordConfig.label} password. Do not use this outside local development.`);
    return DEFAULT_PASSWORDS[passwordConfig.key];
  }

  const password = rawPassword.trim();
  if (isDefaultLikePassword(password)) {
    if (production) {
      throw new Error(`${passwordConfig.key} must not use a default or placeholder value in production. Set a unique password for the ${passwordConfig.label} user.`);
    }
    warnDefaultOnce(passwordConfig.key, `${passwordConfig.key} uses a default or placeholder value; this is acceptable only for local development.`);
  }

  return password;
}

function getJwtSecretIssue(secret: string): string | null {
  if (secret.length < MIN_PRODUCTION_JWT_SECRET_LENGTH) {
    return `it is shorter than ${MIN_PRODUCTION_JWT_SECRET_LENGTH} characters`;
  }

  if (KNOWN_DEMO_JWT_SECRETS.has(secret) || isDefaultLikeValue(secret)) {
    return 'it matches a known demo or placeholder value';
  }

  return null;
}

function isDefaultLikePassword(password: string): boolean {
  return KNOWN_DEMO_PASSWORDS.has(password.toLowerCase()) || isDefaultLikeValue(password);
}

function isDefaultLikeValue(value: string): boolean {
  return DEFAULT_LIKE_PATTERNS.some((pattern) => pattern.test(value));
}

function isProduction(configService: ConfigService): boolean {
  return readOptionalString(configService, 'NODE_ENV')?.trim() === 'production';
}

function readOptionalString(configService: ConfigService, key: string): string | undefined {
  const value = configService.get<string | undefined>(key);
  return typeof value === 'string' ? value : undefined;
}

function isMissing(value: string | undefined): value is undefined {
  return value == null || value.trim() === '';
}

function warnDefaultOnce(key: string, message: string): void {
  if (warnedDefaults.has(key)) {
    return;
  }

  warnedDefaults.add(key);
  console.warn(`[auth-config] ${message}`);
}

export function resetAuthEnvValidationWarningsForTests(): void {
  warnedDefaults.clear();
}
