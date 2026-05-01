#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envFile = process.env.PREFLIGHT_ENV_FILE || '.env';
const envPath = path.resolve(process.cwd(), envFile);

loadEnvFile(envPath);

const checks = [
  requiredUrl('APP_URL', { httpsInProduction: true }),
  requiredUrl('APP_ORIGIN', { httpsInProduction: true }),
  requiredOrigins('CORS_ORIGIN'),
  requiredString('DB_HOST'),
  requiredPort('DB_PORT'),
  requiredString('DB_USERNAME'),
  requiredString('DB_PASSWORD', { rejectDefaultLike: true }),
  requiredString('DB_DATABASE'),
  requiredBoolean('DB_SYNCHRONIZE'),
  requiredRedisConfig(),
  requiredString('JWT_SECRET', { minLength: 32, rejectDefaultLike: true }),
  requiredString('ADMIN_PASSWORD', { rejectDefaultLike: true }),
  requiredString('OPERATOR_PASSWORD', { rejectDefaultLike: true }),
  requiredString('VIEWER_PASSWORD', { rejectDefaultLike: true }),
  requiredString('STRIPE_API_KEY', { rejectDefaultLike: true }),
  requiredString('STRIPE_WEBHOOK_SECRET', { rejectDefaultLike: true }),
  requiredString('PAYPAL_CLIENT_ID', { rejectDefaultLike: true }),
  requiredString('PAYPAL_CLIENT_SECRET', { rejectDefaultLike: true }),
  requiredString('PAYPAL_WEBHOOK_ID', { rejectDefaultLike: true }),
  requiredEnum('PAYPAL_ENVIRONMENT', ['sandbox', 'live']),
  requiredString('RAZORPAY_KEY_ID', { rejectDefaultLike: true }),
  requiredString('RAZORPAY_KEY_SECRET', { rejectDefaultLike: true }),
  requiredString('RAZORPAY_WEBHOOK_SECRET', { rejectDefaultLike: true }),
];

const failures = checks.flatMap((check) => check());

if (failures.length > 0) {
  console.error('Environment preflight failed. Fix the following before deploying:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Environment preflight passed. Required deployment variables are present and well-formed.');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key] != null) {
      continue;
    }
    process.env[parsed.key] = parsed.value;
  }
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const normalized = trimmed.startsWith('export ') ? trimmed.slice('export '.length).trim() : trimmed;
  const equalsIndex = normalized.indexOf('=');
  if (equalsIndex === -1) {
    return null;
  }

  const key = normalized.slice(0, equalsIndex).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return null;
  }

  return { key, value: stripEnvValue(normalized.slice(equalsIndex + 1).trim()) };
}

function stripEnvValue(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  const commentIndex = value.search(/\s#/);
  return commentIndex === -1 ? value : value.slice(0, commentIndex).trim();
}

function requiredString(name, options = {}) {
  return () => {
    const value = getValue(name);
    const errors = [];

    if (!value) {
      return [`${name} is required. Set ${name} in Render or your local .env file.`];
    }

    if (options.minLength && value.length < options.minLength) {
      errors.push(`${name} must be at least ${options.minLength} characters long.`);
    }

    if (options.rejectDefaultLike && isDefaultLike(value)) {
      errors.push(`${name} must not be a placeholder, demo, test, or default value.`);
    }

    return errors;
  };
}

function requiredUrl(name, options = {}) {
  return () => {
    const value = getValue(name);
    if (!value) {
      return [`${name} is required. Set ${name} to an absolute http(s) URL.`];
    }
    if (isDefaultLike(value)) {
      return [`${name} must not be a placeholder, demo, test, or default value.`];
    }

    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return [`${name} must use http or https.`];
      }
      if (options.httpsInProduction && isProduction() && url.protocol !== 'https:') {
        return [`${name} must use https when NODE_ENV=production.`];
      }
      return [];
    } catch {
      return [`${name} must be a valid absolute URL.`];
    }
  };
}

function requiredOrigins(name) {
  return () => {
    const value = getValue(name);
    if (!value) {
      return [`${name} is required. Set one or more comma-separated http(s) origins.`];
    }

    return value.split(',').flatMap((origin) => {
      const trimmed = origin.trim();
      if (!trimmed) {
        return [`${name} contains an empty origin. Remove extra commas.`];
      }
      if (isDefaultLike(trimmed)) {
        return [`${name} origin must not be a placeholder, demo, test, or default value: ${trimmed}`];
      }

      try {
        const url = new URL(trimmed);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return [`${name} origin must use http or https: ${trimmed}`];
        }
        if (isProduction() && url.protocol !== 'https:') {
          return [`${name} origin must use https when NODE_ENV=production: ${trimmed}`];
        }
        return [];
      } catch {
        return [`${name} contains an invalid origin: ${trimmed}`];
      }
    });
  };
}

function requiredRedisConfig() {
  return () => {
    const redisUrl = getValue('REDIS_URL');
    if (redisUrl) {
      return validateRedisUrl(redisUrl);
    }

    return [
      requiredString('REDIS_HOST')(),
      requiredPort('REDIS_PORT')(),
      requiredString('REDIS_PASSWORD', { rejectDefaultLike: true })(),
      requiredBoolean('REDIS_TLS')(),
    ].flat();
  };
}

function validateRedisUrl(value) {
  if (isDefaultLike(value)) {
    return ['REDIS_URL must not be a placeholder, demo, test, or default value.'];
  }

  try {
    const url = new URL(value);
    if (!['redis:', 'rediss:'].includes(url.protocol)) {
      return ['REDIS_URL must use redis or rediss.'];
    }
    if (isProduction() && url.protocol !== 'rediss:') {
      return ['REDIS_URL must use rediss when NODE_ENV=production.'];
    }
    if (!url.hostname) {
      return ['REDIS_URL must include a host.'];
    }
    if (!url.password) {
      return ['REDIS_URL must include a password.'];
    }
    if (url.password && isDefaultLike(decodeURIComponent(url.password))) {
      return ['REDIS_URL password must not be a placeholder, demo, test, or default value.'];
    }
    return [];
  } catch {
    return ['REDIS_URL must be a valid redis:// or rediss:// URL.'];
  }
}

function requiredPort(name) {
  return () => {
    const value = getValue(name);
    const port = Number(value);
    if (!value) {
      return [`${name} is required. Set ${name} to a TCP port number.`];
    }
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return [`${name} must be an integer between 1 and 65535.`];
    }
    return [];
  };
}

function requiredBoolean(name) {
  return () => {
    const value = getValue(name);
    if (!value) {
      return [`${name} is required. Set ${name} to true or false.`];
    }
    if (!['true', 'false'].includes(value.toLowerCase())) {
      return [`${name} must be true or false.`];
    }
    return [];
  };
}

function requiredEnum(name, allowedValues) {
  return () => {
    const value = getValue(name);
    if (!value) {
      return [`${name} is required. Set ${name} to one of: ${allowedValues.join(', ')}.`];
    }
    if (!allowedValues.includes(value)) {
      return [`${name} must be one of: ${allowedValues.join(', ')}.`];
    }
    return [];
  };
}

function getValue(name) {
  return process.env[name]?.trim();
}

function isProduction() {
  return getValue('NODE_ENV') === 'production';
}

function isDefaultLike(value) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('<')
    || normalized.includes('xxxxx')
    || normalized.includes('change-me')
    || normalized.includes('your-')
    || normalized === 'changeme'
    || normalized === 'password'
    || normalized === 'password123'
    || normalized === 'admin123'
    || normalized === 'operator123'
    || normalized === 'viewer123'
    || normalized === 'test-secret'
    || normalized === 'paynest-dev-secret-change-in-production';
}
