import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis | null => {
        const host = configService.get<string>('REDIS_HOST');
        if (!host || host === 'localhost') {
          return null;
        }
        try {
          const redisConfig = {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
            retryStrategy: (times: number) => Math.min(times * 50, 2000),
            lazyConnect: true,
          };
          const redis = new Redis(redisConfig);
          redis.connect().catch(() => {});
          return redis;
        } catch {
          return null;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
