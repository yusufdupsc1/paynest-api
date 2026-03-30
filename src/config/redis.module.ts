import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

function isTlsEnabled(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return String(value).trim().toLowerCase() === 'true';
}

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis | null => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const host = configService.get<string>('REDIS_HOST');
        if ((!redisUrl && (!host || host === 'localhost'))) {
          return null;
        }

        try {
          const shouldUseTls = redisUrl?.startsWith('rediss://')
            || isTlsEnabled(configService.get<string | boolean | undefined>('REDIS_TLS'));

          const redisConfig = redisUrl
            ? {
                lazyConnect: true,
                retryStrategy: (times: number) => Math.min(times * 50, 2000),
                tls: shouldUseTls ? {} : undefined,
              }
            : {
                host: configService.get<string>('REDIS_HOST', 'localhost'),
                port: configService.get<number>('REDIS_PORT', 6379),
                password: configService.get<string>('REDIS_PASSWORD') || undefined,
                lazyConnect: true,
                retryStrategy: (times: number) => Math.min(times * 50, 2000),
                tls: shouldUseTls ? {} : undefined,
              };

          const redis = redisUrl
            ? new Redis(redisUrl, redisConfig)
            : new Redis(redisConfig);

          redis.on('error', () => {});

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
