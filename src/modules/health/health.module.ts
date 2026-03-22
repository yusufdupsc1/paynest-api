import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { GatewayModule } from '../../gateways/gateway.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [GatewayModule, WebhooksModule],
  controllers: [HealthController],
})
export class HealthModule {}
