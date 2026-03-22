import {
  GatewayType,
  TransactionStatus,
  WebhookProcessingStatus,
  WebhookSignatureStatus,
} from '../../src/common/types';
import { WebhookEvent } from '../../src/modules/webhooks/entities/webhook-event.entity';

export const canonicalStripeHeaders = {
  'stripe-signature': 't=1710000000,v1=signature-test',
  'content-type': 'application/json',
};

export const canonicalStripeWebhookPayload = {
  id: 'evt_test_001',
  type: 'payment_intent.succeeded',
  data: {
    object: {
      id: 'pi_test_001',
      amount: 12550,
      currency: 'usd',
      status: 'succeeded',
    },
  },
};

export function createWebhookEventFixture(
  overrides: Partial<WebhookEvent> = {},
): WebhookEvent {
  return {
    id: 'webhook-event-001',
    gateway: GatewayType.STRIPE,
    eventId: 'evt_test_001',
    eventType: 'payment_intent.succeeded',
    normalizedEventKey: 'stripe:evt_test_001',
    payload: canonicalStripeWebhookPayload,
    rawBody: JSON.stringify(canonicalStripeWebhookPayload),
    headers: canonicalStripeHeaders,
    status: WebhookProcessingStatus.RECEIVED,
    signatureStatus: WebhookSignatureStatus.VALID,
    signatureValid: true,
    duplicateOfEventId: null,
    receivedAt: new Date('2026-03-21T12:00:00.000Z'),
    processingStartedAt: null,
    firstProcessedAt: null,
    processedAt: null,
    retryCount: 0,
    nextRetryAt: null,
    errorMessage: null,
    replayCount: 0,
    lastReplayAt: null,
    lastReplayReason: null,
    createdAt: new Date('2026-03-21T12:00:00.000Z'),
    updatedAt: new Date('2026-03-21T12:00:00.000Z'),
    ...overrides,
  };
}

export const processedStripeWebhookEvent = createWebhookEventFixture({
  status: WebhookProcessingStatus.PROCESSED,
  processedAt: new Date('2026-03-21T12:01:00.000Z'),
  firstProcessedAt: new Date('2026-03-21T12:01:00.000Z'),
});

export const completedTransactionProjection = {
  id: 'txn-001',
  externalId: 'pi_test_001',
  gateway: GatewayType.STRIPE,
  amount: 125.5,
  refundedAmount: 0,
  status: TransactionStatus.COMPLETED,
};
