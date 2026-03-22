import { GatewayService } from "../../src/gateways/gateway.service";
import { AuditService } from "../../src/modules/audit/audit.service";
import { TransactionsService } from "../../src/modules/transactions/transactions.service";
import { WebhookEvent } from "../../src/modules/webhooks/entities/webhook-event.entity";
import { WebhooksService } from "../../src/modules/webhooks/webhooks.service";
import { createWebhookEventFixture } from "../fixtures/webhooks";
import { createMockRepository } from "../helpers/mock-repository";

describe("Performance smoke", () => {
  it("computes backlog summaries within a pragmatic in-memory threshold", async () => {
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
      { verifyWebhook: jest.fn() } as Pick<
        GatewayService,
        "verifyWebhook"
      > as never,
      { findByExternalId: jest.fn(), updateStatus: jest.fn() } as Pick<
        TransactionsService,
        "findByExternalId" | "updateStatus"
      > as never,
      { recordEntry: jest.fn() } as Pick<AuditService, "recordEntry"> as never,
    );

    const startedAt = performance.now();
    await service.getBacklogSummary();
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(50);
  });
});
