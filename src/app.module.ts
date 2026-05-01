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

function decoded(value: string | null): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function resolveHostToIPv4(host: string): Promise<string> {
  try {
    const dns = require('dns').promises;
    const result = await dns.lookup(host, { family: 4 });
    console.error(`[TypeOrm] Resolved ${host} → IPv4: ${result.address}`);
    return result.address;
  } catch (err) {
    console.error(`[TypeOrm] IPv4 DNS lookup failed for ${host}: ${err.message}. Using hostname directly.`);
    return host;
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
       useFactory: async (configService: ConfigService) => {
         const rawSynchronize = configService.get<string | boolean | undefined>('DB_SYNCHRONIZE');
         const synchronize = typeof rawSynchronize === 'boolean'
           ? rawSynchronize
           : rawSynchronize == null
             ? configService.get('NODE_ENV') !== 'production'
             : rawSynchronize.trim().toLowerCase() === 'true';

         // Try DATABASE_URL first
         const databaseUrl = configService.get<string>('DATABASE_URL');
         
         if (databaseUrl) {
           try {
             const parsed = new URL(databaseUrl);
             const host = parsed.hostname;
             const port = parseInt(parsed.port) || 5432;
             const username = decoded(parsed.username);
             const password = decoded(parsed.password);
             const database = parsed.pathname.slice(1);
             
             // Resolve hostname to IPv4 to bypass IPv6 ENETUNREACH
             const resolvedHost = await resolveHostToIPv4(host);
             
             console.error(`[TypeOrm] Config: host=${resolvedHost}, port=${port}, db=${database}`);
             
             return {
               type: 'postgres',
               host: resolvedHost,
               port,
               username,
               password,
               database,
               entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily, AuditLog],
               synchronize,
               logging: false,
               extra: {
                 // @ts-ignore - forces IPv4 sockets
                 family: 4,
               },
             };
           } catch (err) {
             console.error(`[TypeOrm] Failed to parse DATABASE_URL: ${err.message}. Falling back to DB_* vars.`);
           }
         }
         
         // Fallback to DB_* environment variables
         const host = configService.get('DB_HOST', 'localhost');
         const port = configService.get<number>('DB_PORT', 5432);
         const username = configService.get('DB_USERNAME', 'postgres');
         const password = configService.get('DB_PASSWORD', 'postgres');
         const database = configService.get('DB_DATABASE', 'payment_dashboard');
         
         // Resolve to IPv4
         const resolvedHost = await resolveHostToIPv4(host);
         
         console.error(`[TypeOrm] Config: host=${resolvedHost}, port=${port}, db=${database}`);

         return {
           type: 'postgres',
           host: resolvedHost,
           port,
           username,
           password,
           database,
           entities: [Transaction, WebhookEvent, Refund, AnalyticsDaily, AuditLog],
           synchronize,
           logging: false,
           extra: {
             // @ts-ignore
             family: 4,
           },
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
