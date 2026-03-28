import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import {
  GatewayType,
  TransactionStatus,
  RefundStatus,
  PaymentCustomer,
  PaymentMetadata,
  PaymentResponse,
  RefundResponse,
  WebhookVerificationResult,
} from '../../common/types';
import * as crypto from 'crypto';
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';

@Injectable()
export class RazorpayGateway implements IGateway {
  private readonly logger = new Logger(RazorpayGateway.name);
  readonly type = GatewayType.RAZORPAY;
  readonly name = 'Razorpay (India)';

  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || '';
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';
    this.baseUrl = this.configService.get<string>('RAZORPAY_BASE_URL') || 'https://api.razorpay.com/v1';
  }

  async createPayment(
    amount: number,
    currency: string,
    customer: PaymentCustomer,
    idempotencyKey: string,
    metadata?: PaymentMetadata,
    returnUrl?: string,
  ): Promise<PaymentResponse> {
    try {
      const callbackUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'return', gateway: this.type },
      );

      const orderPayload = {
        amount: Math.round(amount * 100),
        currency: currency || 'INR',
        receipt: idempotencyKey,
        notes: {
          email: customer.email,
          phone: customer.phone,
          ...metadata,
        },
        callback_url: returnUrl || callbackUrl,
      };

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Razorpay order creation failed: ${error}`);
      }

      const order = await response.json() as { id: string; status: string; short_url?: string };

      return {
        success: true,
        transactionId: order.id,
        externalId: order.id,
        gateway: this.type,
        gatewayResponse: order,
        paymentUrl: order.short_url,
        status: this.mapStatus(order.status),
      };
    } catch (error) {
      this.logger.error(`Razorpay payment creation failed: ${error}`);
      return {
        success: false,
        gateway: this.type,
        status: TransactionStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(
    payload: string | Record<string, unknown>,
    headers: Record<string, string>,
  ): Promise<WebhookVerificationResult> {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return { valid: false, error: 'Webhook secret not configured' };
    }

    try {
      const signature = headers['x-razorpay-signature'];
      if (!signature) {
        return { valid: false, error: 'Missing razorpay signature' };
      }

      const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payloadString)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }

      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

      return {
        valid: true,
        eventId: data.payload?.payment?.entity?.id || data.payload?.order?.entity?.id,
        eventType: data.event,
        payload: data.payload,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  async createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
  ): Promise<RefundResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${transactionExternalId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          notes: reason ? { reason } : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Razorpay refund failed: ${error}`);
      }

      const refund = await response.json() as { id: string; status: string };

      return {
        success: refund.status === 'created',
        refundId: refund.id,
        externalRefundId: refund.id,
        status: refund.status === 'created' ? RefundStatus.PENDING : RefundStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Razorpay refund failed: ${error}`);
      return {
        success: false,
        status: RefundStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${externalId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get Razorpay order: ${response.statusText}`);
      }

      const order = await response.json() as { id: string; status: string };

      return {
        success: order.status === 'paid',
        externalId: order.id,
        gateway: this.type,
        status: this.mapStatus(order.status),
        gatewayResponse: order,
      };
    } catch (error) {
      return {
        success: false,
        gateway: this.type,
        status: TransactionStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    const statusMap: Record<string, TransactionStatus> = {
      created: TransactionStatus.PENDING,
      pending: TransactionStatus.PENDING,
      attempted: TransactionStatus.PENDING,
      paid: TransactionStatus.COMPLETED,
      failed: TransactionStatus.FAILED,
    };
    return statusMap[gatewayStatus.toLowerCase()] || TransactionStatus.PENDING;
  }
}
