import { IdempotencyService } from '../../src/modules/transactions/idempotency.service';

describe('IdempotencyService', () => {
  describe('without Redis', () => {
    let service: IdempotencyService;

    beforeEach(() => {
      service = new IdempotencyService(null);
    });

    it('returns null for non-existent key', async () => {
      const result = await service.checkAndStore('nonexistent');
      expect(result).toBeNull();
    });

    it('stores and retrieves idempotency key', async () => {
      await service.store('key-1', 'txn-1');
      const result = await service.checkAndStore('key-1');
      expect(result).toBe('txn-1');
    });

    it('deletes idempotency key', async () => {
      await service.store('key-2', 'txn-2');
      await service.delete('key-2');
      const result = await service.checkAndStore('key-2');
      expect(result).toBeNull();
    });

    it('checks key existence', async () => {
      await service.store('key-3', 'txn-3');
      expect(await service.exists('key-3')).toBe(true);
      expect(await service.exists('nonexistent')).toBe(false);
    });
  });

  describe('with Redis (mocked)', () => {
    let service: IdempotencyService;
    let mockRedis: {
      get: jest.Mock;
      setex: jest.Mock;
      del: jest.Mock;
      exists: jest.Mock;
      on: jest.Mock;
      connect: jest.Mock;
    };

    beforeEach(() => {
      mockRedis = {
        get: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        exists: jest.fn(),
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(undefined),
      };
      service = new IdempotencyService(mockRedis as never);
    });

    it('returns existing transaction id from Redis', async () => {
      mockRedis.get.mockResolvedValue('txn-existing');

      const result = await service.checkAndStore('key-redis');

      expect(result).toBe('txn-existing');
      expect(mockRedis.get).toHaveBeenCalledWith('idempotency:key-redis');
    });

    it('stores idempotency key in Redis', async () => {
      mockRedis.setex.mockResolvedValue('OK');

      await service.store('key-redis', 'txn-new');

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'idempotency:key-redis',
        86400,
        'txn-new',
      );
    });

    it('deletes idempotency key from Redis', async () => {
      mockRedis.del.mockResolvedValue(1);

      await service.delete('key-redis');

      expect(mockRedis.del).toHaveBeenCalledWith('idempotency:key-redis');
    });

    it('checks key existence in Redis', async () => {
      mockRedis.exists.mockResolvedValue(1);
      expect(await service.exists('key-redis')).toBe(true);

      mockRedis.exists.mockResolvedValue(0);
      expect(await service.exists('key-missing')).toBe(false);
    });

    it('falls back to memory when Redis get fails', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.checkAndStore('key-fallback');

      expect(result).toBeNull();
    });

    it('falls back to memory when Redis setex fails', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Redis error'));

      await service.store('key-fallback', 'txn-fb');

      const result = await service.checkAndStore('key-fallback');
      expect(result).toBe('txn-fb');
    });
  });
});
