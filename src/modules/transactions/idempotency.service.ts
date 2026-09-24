import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import Redis from 'ioredis';

const REDIS_TOKEN = 'REDIS_CLIENT';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly KEY_PREFIX = 'idempotency:';
  private readonly LOCK_PREFIX = 'idempotency:lock:';
  private readonly EXPIRATION_SECONDS = 86400;
  private readonly LOCK_TTL_SECONDS = 60;
  private readonly memoryCache = new Map<string, { value: string; expiry: number }>();
  private readonly memoryLocks = new Map<string, { token: string; expiry: number }>();
  private redisAvailable = true;

  constructor(@Optional() @Inject(REDIS_TOKEN) private readonly redis: Redis | null) {
    if (!this.redis) {
      this.logger.warn('Redis not configured - using in-memory store (not recommended for production)');
      this.redisAvailable = false;
      return;
    }

    this.redis.on('error', () => {
      this.logger.warn('Redis connection error - falling back to in-memory store');
      this.redisAvailable = false;
    });
  }

  /**
   * Atomically acquire a distributed lock for an idempotency key.
   * Returns true only if this caller is the current owner.
   */
  async acquireLock(key: string, token: string, ttlSeconds: number = this.LOCK_TTL_SECONDS): Promise<boolean> {
    const lockKey = `${this.LOCK_PREFIX}${key}`;

    if (this.redis && this.redisAvailable) {
      try {
        const result = await this.redis.set(lockKey, token, 'EX', ttlSeconds, 'NX');
        return result === 'OK';
      } catch {
        this.redisAvailable = false;
      }
    }

    const existing = this.memoryLocks.get(lockKey);
    if (existing && existing.expiry > Date.now() && existing.token !== token) {
      return false;
    }

    this.memoryLocks.set(lockKey, { token, expiry: Date.now() + ttlSeconds * 1000 });
    return true;
  }

  /**
   * Atomically release a lock only if held by the supplied token.
   */
  async releaseLock(key: string, token: string): Promise<void> {
    const lockKey = `${this.LOCK_PREFIX}${key}`;

    if (this.redis && this.redisAvailable) {
      try {
        const script = `if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end`;
        await this.redis.eval(script, 1, lockKey, token);
        return;
      } catch {
        this.redisAvailable = false;
      }
    }

    const existing = this.memoryLocks.get(lockKey);
    if (existing && existing.token === token) {
      this.memoryLocks.delete(lockKey);
    }
  }

  /**
   * Persist the mapping from idempotency key -> transaction id.
   * Safe to call only after the transaction has been durably saved.
   */
  async storeMapping(key: string, transactionId: string, ttlSeconds: number = this.EXPIRATION_SECONDS): Promise<void> {
    const fullKey = `${this.KEY_PREFIX}${key}`;

    if (this.redis && this.redisAvailable) {
      try {
        await this.redis.setex(fullKey, ttlSeconds, transactionId);
        return;
      } catch {
        this.redisAvailable = false;
      }
    }

    this.memoryCache.set(fullKey, {
      value: transactionId,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  async getMapping(key: string): Promise<string | null> {
    const fullKey = `${this.KEY_PREFIX}${key}`;

    if (this.redis && this.redisAvailable) {
      try {
        return await this.redis.get(fullKey);
      } catch {
        this.redisAvailable = false;
      }
    }

    const cached = this.memoryCache.get(fullKey);
    return cached && cached.expiry > Date.now() ? cached.value : null;
  }

  async removeMapping(key: string): Promise<void> {
    const fullKey = `${this.KEY_PREFIX}${key}`;

    if (this.redis && this.redisAvailable) {
      try {
        await this.redis.del(fullKey);
        return;
      } catch {
        this.redisAvailable = false;
      }
    }

    this.memoryCache.delete(fullKey);
  }

  async get(key: string): Promise<string | null> {
    return this.getMapping(key);
  }
}
