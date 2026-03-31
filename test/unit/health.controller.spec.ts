import { HealthController } from '../../src/modules/health/health.controller';
import { GatewayService } from '../../src/gateways/gateway.service';
import { WebhooksService } from '../../src/modules/webhooks/webhooks.service';
import { GatewayType } from '../../src/common/types';

describe('HealthController', () => {
  let controller: HealthController;
  let gatewayService: jest.Mocked<Pick<GatewayService, 'getSupportedGateways'>>;
  let webhooksService: jest.Mocked<Pick<WebhooksService, 'getBacklogSummary' | 'getReliabilitySummary'>>;

  beforeEach(() => {
    gatewayService = {
      getSupportedGateways: jest.fn(),
    };
    webhooksService = {
      getBacklogSummary: jest.fn(),
      getReliabilitySummary: jest.fn(),
    };

    controller = new HealthController(gatewayService as never, webhooksService as never);
  });

  describe('healthCheck', () => {
    it('returns ok status with gateway and webhook info', async () => {
      gatewayService.getSupportedGateways.mockReturnValue([
        { type: GatewayType.STRIPE, name: 'Stripe' },
      ]);
      webhooksService.getBacklogSummary.mockResolvedValue({
        total: 0,
        retryable: 0,
        failed: 0,
        processing: 0,
        invalidSignature: 0,
        oldestPendingAt: null,
      });
      webhooksService.getReliabilitySummary.mockResolvedValue({
        status: 'healthy',
        replayable: 0,
        blockedReplay: 0,
        maxRetriesExceeded: 0,
        lastReceivedAt: null,
        lastProcessedAt: null,
        backlogAgeSeconds: null,
        recent24h: { received: 0, processed: 0, failed: 0, invalidSignature: 0, replayed: 0 },
      });

      const result = await controller.healthCheck();

      expect(result.status).toBe('ok');
      expect(result.gateways).toEqual([{ type: 'stripe', name: 'Stripe' }]);
      expect(result.webhooks.backlog.total).toBe(0);
      expect(result.webhooks.reliability.status).toBe('healthy');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('reflects active webhook backlog', async () => {
      gatewayService.getSupportedGateways.mockReturnValue([]);
      webhooksService.getBacklogSummary.mockResolvedValue({
        total: 5,
        retryable: 2,
        failed: 1,
        processing: 2,
        invalidSignature: 0,
        oldestPendingAt: '2026-03-31T10:00:00.000Z',
      });
      webhooksService.getReliabilitySummary.mockResolvedValue({
        status: 'active',
        replayable: 3,
        blockedReplay: 0,
        maxRetriesExceeded: 1,
        lastReceivedAt: '2026-03-31T12:00:00.000Z',
        lastProcessedAt: '2026-03-31T11:55:00.000Z',
        backlogAgeSeconds: 7200,
        recent24h: { received: 10, processed: 8, failed: 1, invalidSignature: 0, replayed: 0 },
      });

      const result = await controller.healthCheck();

      expect(result.webhooks.reliability.status).toBe('active');
      expect(result.webhooks.backlog.total).toBe(5);
    });
  });

  describe('listGateways', () => {
    it('returns gateway list from service', async () => {
      gatewayService.getSupportedGateways.mockReturnValue([
        { type: GatewayType.STRIPE, name: 'Stripe' },
        { type: GatewayType.PAYPAL, name: 'PayPal' },
      ]);

      const result = await controller.listGateways();

      expect(result).toHaveLength(2);
      expect(result[0]!.type).toBe('stripe');
    });
  });
});
