import {
  GatewayType,
  PaymentCustomer,
  PaymentMetadata,
  PaymentResponse,
  RefundResponse,
  WebhookVerificationResult,
  TransactionStatus,
} from '../../common/types';

export interface PaymentIntent {
  id: string;
  externalId: string;
  status: string;
  amount: number;
  currency: string;
  paymentUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundIntent {
  id: string;
  externalRefundId: string;
  status: string;
  amount: number;
}

export interface IGateway {
  readonly type: GatewayType;
  readonly name: string;

  createPayment(
    amount: number,
    currency: string,
    customer: PaymentCustomer,
    idempotencyKey: string,
    metadata?: PaymentMetadata,
    returnUrl?: string,
  ): Promise<PaymentResponse>;

  verifyWebhook(
    payload: string | Record<string, unknown>,
    headers: Record<string, string>,
  ): Promise<WebhookVerificationResult>;

  createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
    idempotencyKey?: string,
  ): Promise<RefundResponse>;

  getPaymentStatus(externalId: string): Promise<PaymentResponse>;

  mapStatus(gatewayStatus: string): TransactionStatus;
}
