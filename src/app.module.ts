import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { GatewayModule } from './gateways/gateway.module';
import { RedisModule } from './config/redis.module';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { WebhookEvent } from './modules/webhooks/entities/webhook-event.entity';
import { Refund } from './modules/refunds/entities/refund.entity';
import { AnalyticsDaily } from './modules/analytics/entities/analytics-daily.entity';
import { AuditLog } from './modules/audit/entities/audit-log.entity';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

function parseDatabaseUrl(url: string): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} | null {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port) || 5432,
      username: decoded(parsed.username),
      password: decoded(parsed.password),
      database: parsed.pathname.slice(1), // remove leading '/'
    };
  } catch {
    return null;
  }
}

function decoded(value: string | null): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ScheduleModule.forRoot(),
     TypeOrmModule.forRootAsync({
       imports: [ConfigModule],
       useFactory: (configService: ConfigService) => {
         const rawSynchronize = configService.get<string | boolean | undefined>('DB_SYNCHRONIZE');
         const synchronize = typeof rawSynchronize === 'boolean'
           ? rawSynchronize
           : rawSynchronize == null
             ? configService.get('NODE_ENV') !== 'production'
             : rawSynchronize.trim().toLowerCase() === 'true';

         // Prefer DATABASE_URL if available (Prisma-style connection string)
         const databaseUrl = configService.get<string>('DATABASE_URL');

         // Common extra options for pg driver to force IPv4
         // This is the critical fix for ENETUNREACH errors
         const pgExtra = {
           // @ts-ignore - pg driver supports the 'family' option (4 = IPv4, 6 = IPv6)
           family: 4,
         };

         if (databaseUrl) {
           // Parse URL to extract components - ensures TypeORM passes family correctly
           const parsed = parseDatabaseUrl(databaseUrl);
           if (parsed) {
             return {
               type: 'postgres',
               host: parsed.host,
               port: parsed.port,
               username: parsed.username,
               password: parsed.password,
               database: parsed.database,
               entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily, AuditLog],
               synchronize,
               logging: false,
               extra: pgExtra,
             };
           }
           // Fallback to URL string if parsing fails
           return {
             type: 'postgres',
             url: databaseUrl,
             entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily, AuditLog],
             synchronize,
             logging: false,
             extra: pgExtra,
           };
         }

         // Fallback: use individual DB_* variables
         return {
           type: 'postgres',
           host: configService.get('DB_HOST', 'localhost'),
           port: configService.get<number>('DB_PORT', 5432),
           username: configService.get('DB_USERNAME', 'postgres'),
           password: configService.get('DB_PASSWORD', 'postgres'),
           database: configService.get('DB_DATABASE', 'payment_dashboard'),
           entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily, AuditLog],
           synchronize,
           logging: false,
           extra: pgExtra,
         };
       },
       inject: [ConfigService],
     }),
    RedisModule,
    AuthModule,
    GatewayModule,
    AuditModule,
    TransactionsModule,
    WebhooksModule,
    RefundsModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
