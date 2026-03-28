import { Test } from "@nestjs/testing";
import request from "supertest";
import { TransactionsController } from "../../src/modules/transactions/transactions.controller";
import { TransactionsService } from "../../src/modules/transactions/transactions.service";
import { WebhooksController } from "../../src/modules/webhooks/webhooks.controller";
import { WebhooksService } from "../../src/modules/webhooks/webhooks.service";
import { canonicalPaymentRequest } from "../fixtures/requests";
import { canonicalStripeWebhookPayload } from "../fixtures/webhooks";
import { createTestApp } from "../helpers/test-app";

describe("Security smoke e2e", () => {
  jest.setTimeout(15000);

  it("rejects requests missing required idempotency and signature headers", async () => {
    const app = await createTestApp(
      Test.createTestingModule({
        controllers: [TransactionsController, WebhooksController],
        providers: [
          {
            provide: TransactionsService,
            useValue: { createPayment: jest.fn() },
          },
          {
            provide: WebhooksService,
            useValue: {
              processWebhook: jest.fn(),
              replayWebhook: jest.fn(),
              retryWebhook: jest.fn(),
              findAll: jest.fn(),
            },
          },
        ],
      }),
    );

    await request(app.getHttpServer())
      .post("/transactions/initiate")
      .set("Content-Type", "application/json; charset=utf-8")
      .send(canonicalPaymentRequest)
      .expect(400);

    await request(app.getHttpServer())
      .post("/webhooks/stripe")
      .set("Content-Type", "application/json; charset=utf-8")
      .send(canonicalStripeWebhookPayload)
      .expect(400);

    await app.close();
  });
});
