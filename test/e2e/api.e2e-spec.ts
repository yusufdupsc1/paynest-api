import { Test } from "@nestjs/testing";
import request from "supertest";
import { GatewayType, WebhookProcessingStatus } from "../../src/common/types";
import { HealthController } from "../../src/modules/health/health.controller";
import { RefundsController } from "../../src/modules/refunds/refunds.controller";
import { TransactionsController } from "../../src/modules/transactions/transactions.controller";
import { WebhooksController } from "../../src/modules/webhooks/webhooks.controller";
import { canonicalPaymentRequest } from "../fixtures/requests";
import { createTestApp } from "../helpers/test-app";

describe("API e2e", () => {
  const transactionsService = {
    createPayment: jest.fn(),
  };
  const refundsService = {
    createRefund: jest.fn(),
  };
  const webhooksService = {
    processWebhook: jest.fn(),
    replayWebhook: jest.fn(),
    retryWebhook: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getBacklogSummary: jest.fn(),
    getReliabilitySummary: jest.fn(),
  };
  const gatewayService = {
    getSupportedGateways: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("accepts idempotent payment initiation and exposes replay plus health routes", async () => {
    transactionsService.createPayment.mockResolvedValue({
      id: "txn-001",
      gateway: GatewayType.STRIPE,
      status: "pending",
      paymentUrl: "https://checkout.stripe.test/session_001",
    });
    webhooksService.replayWebhook.mockResolvedValue({
      success: true,
      status: WebhookProcessingStatus.PROCESSED,
    });
    webhooksService.getBacklogSummary.mockResolvedValue({
      total: 2,
      retryable: 1,
      failed: 1,
      processing: 0,
      invalidSignature: 0,
      oldestPendingAt: "2026-03-21T12:00:00.000Z",
    });
    webhooksService.getReliabilitySummary.mockResolvedValue({
      status: "active",
      replayable: 7,
      blockedReplay: 0,
      maxRetriesExceeded: 0,
      lastReceivedAt: "2026-03-21T12:15:00.000Z",
      lastProcessedAt: "2026-03-21T12:14:30.000Z",
      backlogAgeSeconds: 90,
      recent24h: {
        received: 11,
        processed: 10,
        failed: 1,
        invalidSignature: 0,
        replayed: 1,
      },
    });
    webhooksService.findAll.mockResolvedValue({
      data: [
        {
          id: "webhook-event-001",
          gateway: GatewayType.STRIPE,
          status: WebhookProcessingStatus.PROCESSED,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      summary: {
        total: 1,
        replayable: 1,
        retryable: 0,
        byGateway: { [GatewayType.STRIPE]: 1 },
        byStatus: { [WebhookProcessingStatus.PROCESSED]: 1 },
        bySignatureStatus: { valid: 1 },
      },
    });
    webhooksService.findOne.mockResolvedValue({
      id: "webhook-event-001",
      gateway: GatewayType.STRIPE,
      status: WebhookProcessingStatus.PROCESSED,
      replayCount: 1,
    });
    gatewayService.getSupportedGateways.mockReturnValue([
      { type: GatewayType.STRIPE, name: "Stripe" },
    ]);

    const app = await createTestApp(
      Test.createTestingModule({
        controllers: [
          TransactionsController,
          RefundsController,
          WebhooksController,
          HealthController,
        ],
        providers: [
          { provide: "TransactionsService", useValue: transactionsService },
          { provide: "RefundsService", useValue: refundsService },
          { provide: "WebhooksService", useValue: webhooksService },
          { provide: "GatewayService", useValue: gatewayService },
          {
            provide: TransactionsController,
            useFactory: () =>
              new TransactionsController(transactionsService as never),
          },
          {
            provide: RefundsController,
            useFactory: () => new RefundsController(refundsService as never),
          },
          {
            provide: WebhooksController,
            useFactory: () => new WebhooksController(webhooksService as never),
          },
          {
            provide: HealthController,
            useFactory: () =>
              new HealthController(
                gatewayService as never,
                webhooksService as never,
              ),
          },
        ],
      }),
    );

    await request(app.getHttpServer())
      .post("/transactions/initiate")
      .set("idempotency-key", "idem-e2e-001")
      .send(canonicalPaymentRequest)
      .expect(201)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.transaction.id).toBe("txn-001");
      });

    await request(app.getHttpServer())
      .post("/webhooks/admin/webhook-event-001/replay")
      .send({ reason: "regression_verification" })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          status: WebhookProcessingStatus.PROCESSED,
        });
      });

    await request(app.getHttpServer())
      .get("/webhooks?gateway=stripe&limit=10")
      .expect(200)
      .expect(({ body }) => {
        expect(body.total).toBe(1);
        expect(body.summary.replayable).toBe(1);
      });

    await request(app.getHttpServer())
      .get("/webhooks/webhook-event-001")
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe("webhook-event-001");
        expect(body.replayCount).toBe(1);
      });

    await request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe("ok");
        expect(body.webhooks.backlog.total).toBe(2);
        expect(body.webhooks.reliability.status).toBe("active");
        expect(body.gateways).toEqual([
          { type: GatewayType.STRIPE, name: "Stripe" },
        ]);
      });

    await app.close();
  });
});
