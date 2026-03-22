import { Test } from "@nestjs/testing";
import request from "supertest";
import { GatewayType, WebhookProcessingStatus } from "../../src/common/types";
import { HealthController } from "../../src/modules/health/health.controller";
import { WebhooksController } from "../../src/modules/webhooks/webhooks.controller";
import { createTestApp } from "../helpers/test-app";

describe("Webhook regression contracts", () => {
  it("keeps replay and backlog contracts stable for hardened webhook flows", async () => {
    const webhooksService = {
      replayWebhook: jest.fn().mockResolvedValue({
        success: false,
        message: "Invalid signature events cannot be replayed",
        status: WebhookProcessingStatus.INVALID_SIGNATURE,
      }),
      getBacklogSummary: jest.fn().mockResolvedValue({
        total: 1,
        retryable: 0,
        failed: 0,
        processing: 0,
        invalidSignature: 1,
        oldestPendingAt: null,
      }),
      getReliabilitySummary: jest.fn().mockResolvedValue({
        status: 'attention',
        replayable: 0,
        blockedReplay: 1,
        maxRetriesExceeded: 0,
        lastReceivedAt: '2026-03-21T12:00:00.000Z',
        lastProcessedAt: null,
        backlogAgeSeconds: null,
        recent24h: {
          received: 1,
          processed: 0,
          failed: 0,
          invalidSignature: 1,
          replayed: 0,
        },
      }),
      processWebhook: jest.fn(),
      retryWebhook: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
    const gatewayService = {
      getSupportedGateways: jest
        .fn()
        .mockReturnValue([{ type: GatewayType.STRIPE, name: "Stripe" }]),
    };

    const app = await createTestApp(
      Test.createTestingModule({
        controllers: [WebhooksController, HealthController],
        providers: [
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
      .post("/webhooks/admin/webhook-event-invalid/replay")
      .send({ reason: "verify_invalid_signature_guard" })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          message: "Invalid signature events cannot be replayed",
          status: WebhookProcessingStatus.INVALID_SIGNATURE,
        });
      });

    await request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect(({ body }) => {
        expect(body.webhooks.backlog).toEqual({
          total: 1,
          retryable: 0,
          failed: 0,
          processing: 0,
          invalidSignature: 1,
          oldestPendingAt: null,
        });
        expect(body.webhooks.reliability).toEqual({
          status: 'attention',
          replayable: 0,
          blockedReplay: 1,
          maxRetriesExceeded: 0,
          lastReceivedAt: '2026-03-21T12:00:00.000Z',
          lastProcessedAt: null,
          backlogAgeSeconds: null,
          recent24h: {
            received: 1,
            processed: 0,
            failed: 0,
            invalidSignature: 1,
            replayed: 0,
          },
        });
      });

    await app.close();
  });
});
