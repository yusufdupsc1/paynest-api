import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { GatewayModule } from './gateways/gateway.module';
import { RedisModule } from './config/redis.module';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { WebhookEvent } from './modules/webhooks/entities/webhook-event.entity';
import { Refund } from './modules/refunds/entities/refund.entity';
import { AnalyticsDaily } from './modules/analytics/entities/analytics-daily.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'payment_dashboard'),
        entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    GatewayModule,
    TransactionsModule,
    WebhooksModule,
    RefundsModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {}
