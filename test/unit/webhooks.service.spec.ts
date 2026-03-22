import {
  AuditActionType,
  GatewayType,
  WebhookProcessingStatus,
  WebhookSignatureStatus,
} from "../../src/common/types";
import { GatewayService } from "../../src/gateways/gateway.service";
import { AuditService } from "../../src/modules/audit/audit.service";
import { TransactionsService } from "../../src/modules/transactions/transactions.service";
import { WebhookEvent } from "../../src/modules/webhooks/entities/webhook-event.entity";
import { WebhooksService } from "../../src/modules/webhooks/webhooks.service";
import {
  canonicalStripeHeaders,
  canonicalStripeWebhookPayload,
  createWebhookEventFixture,
  processedStripeWebhookEvent,
} from "../fixtures/webhooks";
import {
  createMockRepository,
  MockRepository,
} from "../helpers/mock-repository";

describe("WebhooksService", () => {
  let webhookRepository: MockRepository<WebhookEvent>;
  let gatewayService: jest.Mocked<Pick<GatewayService, "verifyWebhook">>;
  let transactionsService: jest.Mocked<
    Pick<TransactionsService, "findByExternalId" | "updateStatus">
  >;
  let auditService: jest.Mocked<Pick<AuditService, "recordEntry">>;
  let service: WebhooksService;

  beforeEach(() => {
    webhookRepository = createMockRepository<WebhookEvent>();
    gatewayService = {
      verifyWebhook: jest.fn(),
    };
    transactionsService = {
      findByExternalId: jest.fn(),
      updateStatus: jest.fn(),
    };
    auditService = {
      recordEntry: jest.fn(),
    };

    service = new WebhooksService(
      webhookRepository as never,
      gatewayService as never,
      transactionsService as never,
      auditService as never,
    );
  });

  it("persists invalid signature events without invoking transaction updates", async () => {
    webhookRepository.findOne.mockResolvedValue(null);
    webhookRepository.create.mockImplementation(
      (entity) =>
        ({
          retryCount: 0,
          replayCount: 0,
          receivedAt: new Date("2026-03-21T12:00:00.000Z"),
          ...entity,
        }) as WebhookEvent,
    );
    webhookRepository.save.mockImplementation(async (event) => event);
    gatewayService.verifyWebhook.mockResolvedValue({
      valid: false,
      error: "signature mismatch",
      eventId: "evt_invalid_001",
      eventType: "payment_intent.succeeded",
      payload: canonicalStripeWebhookPayload,
    });

    const result = await service.processWebhook({
      gateway: GatewayType.STRIPE,
      payload: JSON.stringify(canonicalStripeWebhookPayload),
      headers: canonicalStripeHeaders,
    });

    expect(result).toEqual({
      success: false,
      eventId: "evt_invalid_001",
      message: "signature mismatch",
      status: WebhookProcessingStatus.INVALID_SIGNATURE,
    });
    expect(webhookRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: "evt_invalid_001",
        status: WebhookProcessingStatus.INVALID_SIGNATURE,
        signatureStatus: WebhookSignatureStatus.INVALID,
        signatureValid: false,
      }),
    );
    expect(transactionsService.findByExternalId).not.toHaveBeenCalled();
  });

  it("returns duplicate for already processed events without reprocessing", async () => {
    webhookRepository.findOne.mockResolvedValue(processedStripeWebhookEvent);
    gatewayService.verifyWebhook.mockResolvedValue({
      valid: true,
      eventId: processedStripeWebhookEvent.eventId,
      eventType: processedStripeWebhookEvent.eventType,
      payload: processedStripeWebhookEvent.payload,
    });

    const result = await service.processWebhook({
      gateway: GatewayType.STRIPE,
      payload: canonicalStripeWebhookPayload,
      headers: canonicalStripeHeaders,
    });

    expect(result).toEqual({
      success: true,
      eventId: processedStripeWebhookEvent.eventId,
      message: "Duplicate webhook event",
      status: WebhookProcessingStatus.DUPLICATE,
    });
    expect(webhookRepository.save).not.toHaveBeenCalled();
    expect(transactionsService.updateStatus).not.toHaveBeenCalled();
  });

  it("records blocked replay attempts for invalid-signature events", async () => {
    const invalidEvent = createWebhookEventFixture({
      id: "webhook-event-invalid",
      status: WebhookProcessingStatus.INVALID_SIGNATURE,
      signatureStatus: WebhookSignatureStatus.INVALID,
      signatureValid: false,
    });

    webhookRepository.findOne.mockResolvedValue(invalidEvent);
    auditService.recordEntry.mockResolvedValue({ id: "audit-1" } as never);

    const result = await service.replayWebhook(
      invalidEvent.id,
      "manual investigation",
    );

    expect(result).toEqual({
      success: false,
      message: "Invalid signature events cannot be replayed",
    });
    expect(auditService.recordEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AuditActionType.WEBHOOK_REPLAY_ATTEMPTED,
        entityId: invalidEvent.id,
        gateway: invalidEvent.gateway,
      }),
    );
  });

  it("builds backlog summary from persisted webhook states", async () => {
    webhookRepository.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(4);
    webhookRepository.findOne.mockResolvedValue(
      createWebhookEventFixture({
        receivedAt: new Date("2026-03-20T12:00:00.000Z"),
      }),
    );

    const backlog = await service.getBacklogSummary();

    expect(backlog).toEqual({
      total: 3,
      retryable: 1,
      failed: 2,
      processing: 1,
      invalidSignature: 4,
      oldestPendingAt: "2026-03-20T12:00:00.000Z",
    });
  });

  it("returns filtered webhook feed data with aggregate summary", async () => {
    webhookRepository.find
      .mockResolvedValueOnce([
        createWebhookEventFixture({
          gateway: GatewayType.STRIPE,
          status: WebhookProcessingStatus.FAILED,
          signatureStatus: WebhookSignatureStatus.VALID,
        }),
      ])
      .mockResolvedValueOnce([
        createWebhookEventFixture({
          gateway: GatewayType.STRIPE,
          status: WebhookProcessingStatus.FAILED,
          signatureStatus: WebhookSignatureStatus.VALID,
        }),
      ]);
    webhookRepository.count.mockResolvedValueOnce(1);

    const result = await service.findAll(1, 10, {
      gateway: GatewayType.STRIPE,
      status: WebhookProcessingStatus.FAILED,
    });

    expect(webhookRepository.find).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          gateway: GatewayType.STRIPE,
          status: WebhookProcessingStatus.FAILED,
        },
        take: 10,
      }),
    );
    expect(result.summary).toEqual({
      total: 1,
      replayable: 1,
      retryable: 1,
      byGateway: { [GatewayType.STRIPE]: 1 },
      byStatus: { [WebhookProcessingStatus.FAILED]: 1 },
      bySignatureStatus: { [WebhookSignatureStatus.VALID]: 1 },
    });
  });

  it("builds reliability summary for dashboard-facing operational cues", async () => {
    webhookRepository.count
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);
    webhookRepository.findOne
      .mockResolvedValueOnce(
        createWebhookEventFixture({
          receivedAt: new Date("2026-03-21T11:59:30.000Z"),
        }),
      )
      .mockResolvedValueOnce(
        createWebhookEventFixture({
          status: WebhookProcessingStatus.PROCESSED,
          processedAt: new Date("2026-03-21T12:10:00.000Z"),
        }),
      );

    jest.spyOn(service, "getBacklogSummary").mockResolvedValue({
      total: 2,
      retryable: 1,
      failed: 1,
      processing: 0,
      invalidSignature: 0,
      oldestPendingAt: "2026-03-21T11:55:00.000Z",
    });

    const reliability = await service.getReliabilitySummary();

    expect(reliability).toEqual({
      status: "active",
      replayable: 2,
      blockedReplay: 1,
      maxRetriesExceeded: 1,
      lastReceivedAt: "2026-03-21T11:59:30.000Z",
      lastProcessedAt: "2026-03-21T12:10:00.000Z",
      backlogAgeSeconds: expect.any(Number),
      recent24h: {
        received: 8,
        processed: 5,
        failed: 2,
        invalidSignature: 1,
        replayed: 3,
      },
    });
  });
});
