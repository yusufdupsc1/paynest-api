import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_JWT_SECRET,
  getValidatedAuthPasswords,
  getValidatedJwtSecret,
  resetAuthEnvValidationWarningsForTests,
} from '../../src/modules/auth/auth-env.validation';

describe('auth env validation', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    resetAuthEnvValidationWarningsForTests();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('getValidatedJwtSecret', () => {
    it('throws in production when JWT_SECRET is missing', () => {
      expect(() => getValidatedJwtSecret(config({ NODE_ENV: 'production' }))).toThrow(
        'JWT_SECRET is required in production',
      );
    });

    it('treats blank production JWT_SECRET as missing', () => {
      expect(() => getValidatedJwtSecret(config({ NODE_ENV: 'production', JWT_SECRET: '   ' }))).toThrow(
        'JWT_SECRET is required in production',
      );
    });

    it('throws in production when JWT_SECRET is weak', () => {
      expect(() => getValidatedJwtSecret(config({ NODE_ENV: 'production', JWT_SECRET: 'short-secret' }))).toThrow(
        'JWT_SECRET is insecure in production: it is shorter than 32 characters',
      );
    });

    it('throws in production when JWT_SECRET matches a demo default', () => {
      expect(() =>
        getValidatedJwtSecret(config({
          NODE_ENV: 'production',
          JWT_SECRET: 'change-me-to-a-random-64-char-string',
        })),
      ).toThrow('JWT_SECRET is insecure in production: it matches a known demo or placeholder value');
    });

    it('throws in production when JWT_SECRET is default-like even if long enough', () => {
      expect(() =>
        getValidatedJwtSecret(config({
          NODE_ENV: 'production',
          JWT_SECRET: 'demo-secret-value-that-is-long-enough-for-length',
        })),
      ).toThrow('JWT_SECRET is insecure in production: it matches a known demo or placeholder value');
    });

    it('returns strong production JWT_SECRET values', () => {
      const secret = 'prod_9f2c7e1a5b8d4c6f90123456789abcde';

      expect(getValidatedJwtSecret(config({ NODE_ENV: 'production', JWT_SECRET: secret }))).toBe(secret);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('keeps the development fallback and warns when JWT_SECRET is missing', () => {
      expect(getValidatedJwtSecret(config({ NODE_ENV: 'development' }))).toBe(DEFAULT_JWT_SECRET);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('JWT_SECRET is not set'));
    });
  });

  describe('getValidatedAuthPasswords', () => {
    it('throws in production when any role password is missing', () => {
      expect(() =>
        getValidatedAuthPasswords(config({
          NODE_ENV: 'production',
          ADMIN_PASSWORD: 'real-admin-password',
          OPERATOR_PASSWORD: 'real-operator-password',
        })),
      ).toThrow('VIEWER_PASSWORD is required in production');
    });

    it('throws in production when any role password is default-like', () => {
      expect(() =>
        getValidatedAuthPasswords(config({
          NODE_ENV: 'production',
          ADMIN_PASSWORD: 'admin123',
          OPERATOR_PASSWORD: 'real-operator-password',
          VIEWER_PASSWORD: 'real-viewer-password',
        })),
      ).toThrow('ADMIN_PASSWORD must not use a default or placeholder value in production');
    });

    it('throws in production when a role password is blank', () => {
      expect(() =>
        getValidatedAuthPasswords(config({
          NODE_ENV: 'production',
          ADMIN_PASSWORD: 'real-admin-password',
          OPERATOR_PASSWORD: '   ',
          VIEWER_PASSWORD: 'real-viewer-password',
        })),
      ).toThrow('OPERATOR_PASSWORD is required in production');
    });

    it('returns production passwords when all values are non-default', () => {
      expect(
        getValidatedAuthPasswords(config({
          NODE_ENV: 'production',
          ADMIN_PASSWORD: 'admin-correct-horse-battery',
          OPERATOR_PASSWORD: 'operator-correct-horse-battery',
          VIEWER_PASSWORD: 'viewer-correct-horse-battery',
        })),
      ).toEqual({
        admin: 'admin-correct-horse-battery',
        operator: 'operator-correct-horse-battery',
        viewer: 'viewer-correct-horse-battery',
      });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('keeps development password fallbacks and warns when they are missing', () => {
      expect(getValidatedAuthPasswords(config({ NODE_ENV: 'development' }))).toEqual({
        admin: 'admin123',
        operator: 'operator123',
        viewer: 'viewer123',
      });
      expect(warnSpy).toHaveBeenCalledTimes(3);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ADMIN_PASSWORD is not set'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('OPERATOR_PASSWORD is not set'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('VIEWER_PASSWORD is not set'));
    });
  });
});

function config(values: Record<string, string | undefined>): ConfigService {
  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}
