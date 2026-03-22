import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { Refund } from './entities/refund.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { GatewayModule } from '../../gateways/gateway.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Refund]), TransactionsModule, GatewayModule, AuditModule],
  controllers: [RefundsController],
  providers: [RefundsService],
  exports: [RefundsService],
})
export class RefundsModule {}
