import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from '../../gateways/gateway.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { Public } from '../auth/decorators/public.decorator';
import { WebhookBacklogSummary, WebhookReliabilitySummary } from '../../common/types';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

interface ReadinessResponse extends HealthResponse {
  gateways: Array<{ type: string; name: string }>;
  webhooks: {
    backlog: WebhookBacklogSummary | null;
    reliability: WebhookReliabilitySummary | null;
  };
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly webhooksService: WebhooksService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness probe (no external dependencies)' })
  @ApiResponse({ status: 200, description: 'Service is live' })
  async healthCheck(): Promise<HealthResponse> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (checks DB/Redis-backed subsystems)' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async readinessCheck(): Promise<ReadinessResponse> {
    const gateways = this.gatewayService.getSupportedGateways();
    const base = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      gateways,
    };

    try {
      const backlog = await this.webhooksService.getBacklogSummary();
      const reliability = await this.webhooksService.getReliabilitySummary();
      return { ...base, webhooks: { backlog, reliability } };
    } catch (error) {
      this.loggerError(error);
      return {
        ...base,
        status: 'degraded',
        webhooks: {
          backlog: await this.safeBacklog(),
          reliability: await this.safeReliability(),
        },
      };
    }
  }

  private loggerError(error: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[Health] Readiness check failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  private async safeBacklog(): Promise<WebhookBacklogSummary | null> {
    try {
      return await this.webhooksService.getBacklogSummary();
    } catch {
      return null;
    }
  }

  private async safeReliability(): Promise<WebhookReliabilitySummary | null> {
    try {
      return await this.webhooksService.getReliabilitySummary();
    } catch {
      return null;
    }
  }

  @Public()
  @Get('gateways')
  @ApiOperation({ summary: 'List supported gateways' })
  @ApiResponse({ status: 200, description: 'List of supported gateways' })
  async listGateways(): Promise<Array<{ type: string; name: string }>> {
    return this.gatewayService.getSupportedGateways();
  }
}
