export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed',
}

export enum RefundStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum GatewayType {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BKASH = 'bkash',
  NAGAD = 'nagad',
  RAZORPAY = 'razorpay',
  SSLCOMMERZ = 'sslcommerz',
  AAMARPAY = 'aamarpay',
  PAYTM = 'paytm',
  PHONEPE = 'phonepe',
  UPI = 'upi',
  MERCADOPAGO = 'mercadopago',
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  SQUARE = 'square',
  ADYEN = 'adyen',
}

export enum WebhookProcessingStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  INVALID_SIGNATURE = 'invalid_signature',
  DUPLICATE = 'duplicate',
}

export enum WebhookSignatureStatus {
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid',
  NOT_APPLICABLE = 'not_applicable',
}

export enum AuditEntityType {
  TRANSACTION = 'transaction',
  REFUND = 'refund',
  WEBHOOK_EVENT = 'webhook_event',
}

export enum AuditActionType {
  TRANSACTION_CREATED = 'transaction_created',
  TRANSACTION_STATUS_CHANGED = 'transaction_status_changed',
  REFUND_CREATED = 'refund_created',
  REFUND_STATUS_CHANGED = 'refund_status_changed',
  WEBHOOK_REPLAY_ATTEMPTED = 'webhook_replay_attempted',
}

export interface PaymentCustomer {
  email: string;
  phone: string;
  name?: string;
  address?: {
    line1?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface PaymentMetadata {
  orderId?: string;
  userId?: string;
  description?: string;
  [key: string]: unknown;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  externalId?: string;
  gateway: GatewayType;
  gatewayResponse?: unknown;
  paymentUrl?: string;
  status: TransactionStatus;
  message?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  externalRefundId?: string;
  status: RefundStatus;
  message?: string;
}

export interface WebhookVerificationResult {
  valid: boolean;
  eventId?: string;
  eventType?: string;
  payload?: unknown;
  error?: string;
}

export interface WebhookBacklogSummary {
  total: number;
  retryable: number;
  failed: number;
  processing: number;
  invalidSignature: number;
  oldestPendingAt?: string | null;
}

export interface WebhookEventFilters {
  gateway?: GatewayType;
  status?: WebhookProcessingStatus;
  signatureStatus?: WebhookSignatureStatus;
  replayable?: boolean;
}

export interface WebhookEventSummary {
  total: number;
  replayable: number;
  retryable: number;
  byGateway: Partial<Record<GatewayType, number>>;
  byStatus: Partial<Record<WebhookProcessingStatus, number>>;
  bySignatureStatus: Partial<Record<WebhookSignatureStatus, number>>;
}

export interface WebhookReliabilitySummary {
  status: 'healthy' | 'active' | 'attention';
  replayable: number;
  blockedReplay: number;
  maxRetriesExceeded: number;
  lastReceivedAt: string | null;
  lastProcessedAt: string | null;
  backlogAgeSeconds: number | null;
  recent24h: {
    received: number;
    processed: number;
    failed: number;
    invalidSignature: number;
    replayed: number;
  };
}

export interface ReplayWebhookDto {
  reason?: string;
}
