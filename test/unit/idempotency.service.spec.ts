import { IdempotencyService } from '../../src/modules/transactions/idempotency.service';

describe('IdempotencyService', () => {
  describe('without Redis', () => {
    let service: IdempotencyService;

    beforeEach(() => {
      service = new IdempotencyService(null);
    });

    it('acquires the lock when free', async () => {
      expect(await service.acquireLock('key-1', 'token-a')).toBe(true);
    });

    it('does not re-acquire the lock with a different token', async () => {
      await service.acquireLock('key-1', 'token-a');
      expect(await service.acquireLock('key-1', 'token-b')).toBe(false);
    });

    it('releases the lock only for the owning token', async () => {
      await service.acquireLock('key-1', 'token-a');
      await service.releaseLock('key-1', 'wrong-token');
      expect(await service.acquireLock('key-1', 'token-b')).toBe(false);

      await service.releaseLock('key-1', 'token-a');
      expect(await service.acquireLock('key-1', 'token-b')).toBe(true);
    });

    it('stores and retrieves mapping', async () => {
      await service.storeMapping('key-1', 'txn-1');
      expect(await service.getMapping('key-1')).toBe('txn-1');
      expect(await service.getMapping('nonexistent')).toBeNull();
    });

    it('removes mapping', async () => {
      await service.storeMapping('key-1', 'txn-1');
      await service.removeMapping('key-1');
      expect(await service.getMapping('key-1')).toBeNull();
    });
  });

  describe('with Redis (mocked)', () => {
    let service: IdempotencyService;
    let mockRedis: {
      set: jest.Mock;
      get: jest.Mock;
      setex: jest.Mock;
      del: jest.Mock;
      eval: jest.Mock;
      exists: jest.Mock;
      on: jest.Mock;
      connect: jest.Mock;
    };

    beforeEach(() => {
      mockRedis = {
        set: jest.fn(),
        get: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        eval: jest.fn(),
        exists: jest.fn(),
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(undefined),
      };
      service = new IdempotencyService(mockRedis as never);
    });

    it('acquires lock via atomic SET NX EX', async () => {
      mockRedis.set.mockResolvedValue('OK');

      expect(await service.acquireLock('key-redis', 'token-a')).toBe(true);

      expect(mockRedis.set).toHaveBeenCalledWith(
        'idempotency:lock:key-redis',
        'token-a',
        'EX',
        60,
        'NX',
      );
    });

    it('reports lock contention when Redis returns null', async () => {
      mockRedis.set.mockResolvedValue(null);

      expect(await service.acquireLock('key-redis', 'token-a')).toBe(false);
    });

    it('releases lock via Lua eval only when token matches', async () => {
      mockRedis.eval.mockResolvedValue(1);

      await service.releaseLock('key-redis', 'token-a');

      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        'idempotency:lock:key-redis',
        'token-a',
      );
    });

    it('stores mapping in Redis', async () => {
      mockRedis.setex.mockResolvedValue('OK');

      await service.storeMapping('key-redis', 'txn-new');

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'idempotency:key-redis',
        86400,
        'txn-new',
      );
    });

    it('returns stored mapping from Redis', async () => {
      mockRedis.get.mockResolvedValue('txn-existing');

      expect(await service.getMapping('key-redis')).toBe('txn-existing');
      expect(mockRedis.get).toHaveBeenCalledWith('idempotency:key-redis');
    });

    it('removes mapping from Redis', async () => {
      mockRedis.del.mockResolvedValue(1);

      await service.removeMapping('key-redis');

      expect(mockRedis.del).toHaveBeenCalledWith('idempotency:key-redis');
    });

    it('falls back to memory when Redis acquireLock fails', async () => {
      mockRedis.set.mockRejectedValue(new Error('Redis error'));

      expect(await service.acquireLock('key-fallback', 'token-a')).toBe(true);
    });

    it('falls back to memory when Redis storeMapping fails', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Redis error'));

      await service.storeMapping('key-fallback', 'txn-fb');
      expect(await service.getMapping('key-fallback')).toBe('txn-fb');
    });
  });
});
