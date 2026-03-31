import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
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
