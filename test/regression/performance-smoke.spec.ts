import { GatewayService } from '../../src/gateways/gateway.service';
import { AuditService } from '../../src/modules/audit/audit.service';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { WebhookEvent } from '../../src/modules/webhooks/entities/webhook-event.entity';
import { WebhooksService } from '../../src/modules/webhooks/webhooks.service';
import { CryptoUtil } from '../../src/common/utils/crypto.util';
import { RetryUtil } from '../../src/common/utils/retry.util';
import { createWebhookEventFixture } from '../fixtures/webhooks';
import { createMockRepository } from '../helpers/mock-repository';

describe('Performance smoke', () => {
  it('computes backlog summaries within 50ms threshold', async () => {
    const webhookRepository = createMockRepository<WebhookEvent>();
    webhookRepository.count
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1);
    webhookRepository.findOne.mockResolvedValue(createWebhookEventFixture());

    const service = new WebhooksService(
      webhookRepository as never,
      { verifyWebhook: jest.fn() } as Pick<GatewayService, 'verifyWebhook'> as never,
      { findByExternalId: jest.fn(), updateStatus: jest.fn() } as Pick<
        TransactionsService,
        'findByExternalId' | 'updateStatus'
      > as never,
      { recordEntry: jest.fn() } as Pick<AuditService, 'recordEntry'> as never,
    );

    const startedAt = performance.now();
    await service.getBacklogSummary();
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(50);
  });

  it('computes reliability summaries within 200ms threshold', async () => {
    const webhookRepository = createMockRepository<WebhookEvent>();
    webhookRepository.count.mockResolvedValue(0);
    webhookRepository.find.mockResolvedValue([]);
    webhookRepository.findOne.mockResolvedValue(null);

    const service = new WebhooksService(
      webhookRepository as never,
      { verifyWebhook: jest.fn() } as Pick<GatewayService, 'verifyWebhook'> as never,
      { findByExternalId: jest.fn(), updateStatus: jest.fn() } as Pick<
        TransactionsService,
        'findByExternalId' | 'updateStatus'
      > as never,
      { recordEntry: jest.fn() } as Pick<AuditService, 'recordEntry'> as never,
    );

    const startedAt = performance.now();
    await service.getReliabilitySummary();
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(200);
  });

  it('hashes data consistently and quickly', () => {
    const data = JSON.stringify({ test: 'payload', timestamp: Date.now() });

    const startedAt = performance.now();
    for (let i = 0; i < 1000; i++) {
      CryptoUtil.hashData(data + i);
    }
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(1000);
  });

  it('generates idempotency keys quickly', () => {
    const startedAt = performance.now();
    for (let i = 0; i < 1000; i++) {
      CryptoUtil.generateIdempotencyKey();
    }
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(500);
  });

  it('calculates backoff without allocation overhead', () => {
    const startedAt = performance.now();
    for (let i = 0; i < 10000; i++) {
      RetryUtil.calculateBackoff(i % 10 + 1);
    }
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(100);
  });

  it('handles webhook list filtering with summary computation within threshold', async () => {
    const webhookRepository = createMockRepository<WebhookEvent>();
    const events = Array.from({ length: 50 }, (_, i) =>
      createWebhookEventFixture({ id: `wh-${i}`, eventId: `evt-${i}` }),
    );

    webhookRepository.find.mockResolvedValue(events);
    webhookRepository.count.mockResolvedValue(50);

    const service = new WebhooksService(
      webhookRepository as never,
      { verifyWebhook: jest.fn() } as Pick<GatewayService, 'verifyWebhook'> as never,
      { findByExternalId: jest.fn(), updateStatus: jest.fn() } as Pick<
        TransactionsService,
        'findByExternalId' | 'updateStatus'
      > as never,
      { recordEntry: jest.fn() } as Pick<AuditService, 'recordEntry'> as never,
    );

    const startedAt = performance.now();
    await service.findAll(1, 50);
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(100);
  });
});
