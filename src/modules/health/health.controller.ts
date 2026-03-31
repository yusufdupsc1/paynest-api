import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from '../../gateways/gateway.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly webhooksService: WebhooksService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    gateways: Array<{ type: string; name: string }>;
    webhooks: {
      backlog: {
        total: number;
        retryable: number;
        failed: number;
        processing: number;
        invalidSignature: number;
        oldestPendingAt?: string | null;
      };
      reliability: {
        status: 'healthy' | 'active' | 'attention';
        replayable: number;
        blockedReplay: number;
        maxRetriesExceeded: number;
        lastReceivedAt: string | null;
        lastProcessedAt: string | null;
        backlogAgeSeconds: number | null;
        recent24h: {
          received: number;
          processed: number;
          failed: number;
          invalidSignature: number;
          replayed: number;
        };
      };
    };
  }> {
    const backlog = await this.webhooksService.getBacklogSummary();
    const reliability = await this.webhooksService.getReliabilitySummary();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      gateways: this.gatewayService.getSupportedGateways(),
      webhooks: {
        backlog,
        reliability,
      },
    };
  }

  @Public()
  @Get('gateways')
  @ApiOperation({ summary: 'List supported gateways' })
  @ApiResponse({ status: 200, description: 'List of supported gateways' })
  async listGateways(): Promise<Array<{ type: string; name: string }>> {
    return this.gatewayService.getSupportedGateways();
  }
}
