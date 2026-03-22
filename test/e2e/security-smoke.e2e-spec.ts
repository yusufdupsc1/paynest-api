import request from 'supertest';
import { Test } from '@nestjs/testing';
import { TransactionsController } from '../../src/modules/transactions/transactions.controller';
import { WebhooksController } from '../../src/modules/webhooks/webhooks.controller';
import { createTestApp } from '../helpers/test-app';
import { canonicalPaymentRequest } from '../fixtures/requests';
import { canonicalStripeWebhookPayload } from '../fixtures/webhooks';

describe('Security smoke e2e', () => {
  it('rejects requests missing required idempotency and signature headers', async () => {
    const app = await createTestApp(
      Test.createTestingModule({
        controllers: [TransactionsController, WebhooksController],
        providers: [
          {
            provide: TransactionsController,
            useFactory: () => new TransactionsController({ createPayment: jest.fn() } as never),
          },
          {
            provide: WebhooksController,
            useFactory: () =>
              new WebhooksController({ processWebhook: jest.fn(), replayWebhook: jest.fn(), retryWebhook: jest.fn(), findAll: jest.fn() } as never),
          },
        ],
      }),
    );

    await request(app.getHttpServer())
      .post('/transactions/initiate')
      .send(canonicalPaymentRequest)
      .expect(400);

    await request(app.getHttpServer())
      .post('/webhooks/stripe')
      .send(canonicalStripeWebhookPayload)
      .expect(400);

    await app.close();
  });
});
