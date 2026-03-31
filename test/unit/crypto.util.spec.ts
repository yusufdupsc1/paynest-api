import { CryptoUtil } from '../../src/common/utils/crypto.util';

describe('CryptoUtil', () => {
  describe('generateIdempotencyKey', () => {
    it('generates a valid UUID', () => {
      const key = CryptoUtil.generateIdempotencyKey();
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      expect(key).toMatch(uuidPattern);
    });

    it('generates unique keys', () => {
      const key1 = CryptoUtil.generateIdempotencyKey();
      const key2 = CryptoUtil.generateIdempotencyKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('verifyHmac', () => {
    it('returns true for valid HMAC signature', () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      const signature = require('crypto')
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const result = CryptoUtil.verifyHmac(payload, signature, secret);
      expect(result).toBe(true);
    });

    it('returns false for invalid signature', () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      const validSig = require('crypto')
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      const invalidSig = validSig.slice(0, -4) + 'abcd';

      const result = CryptoUtil.verifyHmac(payload, invalidSig, secret);
      expect(result).toBe(false);
    });

    it('returns false when secret is wrong', () => {
      const payload = 'test-payload';
      const signature = require('crypto')
        .createHmac('sha256', 'wrong-secret')
        .update(payload)
        .digest('hex');

      const result = CryptoUtil.verifyHmac(payload, signature, 'correct-secret');
      expect(result).toBe(false);
    });
  });

  describe('hashData', () => {
    it('generates consistent SHA-256 hash', () => {
      const hash1 = CryptoUtil.hashData('test-data');
      const hash2 = CryptoUtil.hashData('test-data');
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = CryptoUtil.hashData('data-1');
      const hash2 = CryptoUtil.hashData('data-2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSignature', () => {
    it('generates consistent signature for same payload', () => {
      const payload = { b: 2, a: 1 };
      const secret = 'secret';
      const sig1 = CryptoUtil.generateSignature(payload, secret);
      const sig2 = CryptoUtil.generateSignature(payload, secret);
      expect(sig1).toBe(sig2);
    });

    it('generates different signatures for different secrets', () => {
      const payload = { key: 'value' };
      const sig1 = CryptoUtil.generateSignature(payload, 'secret1');
      const sig2 = CryptoUtil.generateSignature(payload, 'secret2');
      expect(sig1).not.toBe(sig2);
    });
  });
});
