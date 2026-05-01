import { spawnSync } from 'child_process';

const scriptPath = 'scripts/preflight-env.js';

describe('preflight env script', () => {
  it('exits non-zero with actionable messages for missing required env vars', () => {
    const result = runPreflight({ NODE_ENV: 'production' });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Environment preflight failed');
    expect(result.stderr).toContain('APP_URL is required');
    expect(result.stderr).toContain('JWT_SECRET is required');
    expect(result.stderr).toContain('PAYPAL_WEBHOOK_ID is required');
  });

  it('passes with well-formed deployment env vars', () => {
    const result = runPreflight(validDeploymentEnv());

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Environment preflight passed');
    expect(result.stderr).toBe('');
  });

  it('passes when Redis is configured with REDIS_URL instead of split vars', () => {
    const result = runPreflight(deploymentEnvWithRedisUrl(
      'rediss://default:redis-password-value@redis.example.com:6379',
    ));

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Environment preflight passed');
    expect(result.stderr).toBe('');
  });

  it('rejects malformed deployment values without printing secret contents', () => {
    const result = runPreflight({
      ...validDeploymentEnv(),
      APP_URL: 'http://localhost:3000',
      DB_PORT: 'not-a-port',
      JWT_SECRET: 'paynest-dev-secret-change-in-production',
      PAYPAL_ENVIRONMENT: 'staging',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('APP_URL must use https when NODE_ENV=production');
    expect(result.stderr).toContain('DB_PORT must be an integer between 1 and 65535');
    expect(result.stderr).toContain('JWT_SECRET must not be a placeholder');
    expect(result.stderr).toContain('PAYPAL_ENVIRONMENT must be one of: sandbox, live');
    expect(result.stderr).not.toContain('paynest-dev-secret-change-in-production');
  });

  it('rejects non-TLS REDIS_URL values in production', () => {
    const result = runPreflight(deploymentEnvWithRedisUrl(
      'redis://default:redis-password-value@redis.example.com:6379',
    ));

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('REDIS_URL must use rediss when NODE_ENV=production');
    expect(result.stderr).not.toContain('redis-password-value');
  });
});

function deploymentEnvWithRedisUrl(redisUrl: string): Record<string, string> {
  const env: Record<string, string> = {
    ...validDeploymentEnv(),
    REDIS_URL: redisUrl,
  };
  delete env.REDIS_HOST;
  delete env.REDIS_PORT;
  delete env.REDIS_PASSWORD;
  delete env.REDIS_TLS;

  return env;
}

function runPreflight(env: Record<string, string>) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    env: {
      PATH: process.env.PATH || '',
      PREFLIGHT_ENV_FILE: '.env.preflight-test-missing',
      ...env,
    },
    encoding: 'utf8',
  });
}

function validDeploymentEnv(): Record<string, string> {
  return {
    NODE_ENV: 'production',
    APP_URL: 'https://api.example.com',
    APP_ORIGIN: 'https://api.example.com',
    CORS_ORIGIN: 'https://app.example.com',
    DB_HOST: 'db.example.com',
    DB_PORT: '5432',
    DB_USERNAME: 'paynest',
    DB_PASSWORD: 'db-password-value',
    DB_DATABASE: 'paynest',
    DB_SYNCHRONIZE: 'false',
    REDIS_HOST: 'redis.example.com',
    REDIS_PORT: '6379',
    REDIS_PASSWORD: 'redis-password-value',
    REDIS_TLS: 'true',
    JWT_SECRET: 'jwt-secret-value-longer-than-32-characters',
    ADMIN_PASSWORD: 'admin-password-value',
    OPERATOR_PASSWORD: 'operator-password-value',
    VIEWER_PASSWORD: 'viewer-password-value',
    STRIPE_API_KEY: 'sk_test_example_key',
    STRIPE_WEBHOOK_SECRET: 'whsec_example_secret',
    PAYPAL_CLIENT_ID: 'paypal-client-id-value',
    PAYPAL_CLIENT_SECRET: 'paypal-client-secret-value',
    PAYPAL_WEBHOOK_ID: 'paypal-webhook-id-value',
    PAYPAL_ENVIRONMENT: 'sandbox',
    RAZORPAY_KEY_ID: 'rzp_test_example_key',
    RAZORPAY_KEY_SECRET: 'razorpay-key-secret-value',
    RAZORPAY_WEBHOOK_SECRET: 'razorpay-webhook-secret-value',
  };
}
