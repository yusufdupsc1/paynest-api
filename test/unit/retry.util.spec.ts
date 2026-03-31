import { RetryUtil } from '../../src/common/utils/retry.util';

describe('RetryUtil', () => {
  describe('calculateBackoff', () => {
    it('returns 1000ms for first attempt', () => {
      expect(RetryUtil.calculateBackoff(1)).toBe(1000);
    });

    it('returns 2000ms for second attempt', () => {
      expect(RetryUtil.calculateBackoff(2)).toBe(2000);
    });

    it('returns 4000ms for third attempt', () => {
      expect(RetryUtil.calculateBackoff(3)).toBe(4000);
    });

    it('caps at 16000ms', () => {
      expect(RetryUtil.calculateBackoff(5)).toBe(16000);
      expect(RetryUtil.calculateBackoff(10)).toBe(16000);
    });

    it('respects custom base delay', () => {
      expect(RetryUtil.calculateBackoff(1, 500)).toBe(500);
      expect(RetryUtil.calculateBackoff(2, 500)).toBe(1000);
      expect(RetryUtil.calculateBackoff(3, 500)).toBe(2000);
    });
  });

  describe('retryWithBackoff', () => {
    it('returns immediately on first success', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await RetryUtil.retryWithBackoff(fn, 3, 1);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and eventually succeeds', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const result = await RetryUtil.retryWithBackoff(fn, 3, 1);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws last error after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('always fails'));

      await expect(RetryUtil.retryWithBackoff(fn, 2, 1)).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('sleep', () => {
    it('resolves after specified delay', async () => {
      const start = Date.now();
      await RetryUtil.sleep(10);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(5);
    });
  });
});
