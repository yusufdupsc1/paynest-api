import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { IdempotencyService } from './idempotency.service';
import { GatewayModule } from '../../gateways/gateway.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), GatewayModule, AuditModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, IdempotencyService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
