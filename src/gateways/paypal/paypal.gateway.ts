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
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';

@Injectable()
export class PayPalGateway implements IGateway {
  private readonly logger = new Logger(PayPalGateway.name);
  readonly type = GatewayType.PAYPAL;
  readonly name = 'PayPal';

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly environment: 'sandbox' | 'live';
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
    this.environment = this.configService.get<string>('PAYPAL_ENVIRONMENT') as 'sandbox' | 'live' || 'sandbox';
    this.baseUrl = this.environment === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000 - 60000);
    return this.accessToken;
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
      const token = await this.getAccessToken();
      const successUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'success' },
      );
      const cancelUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'cancel' },
      );

      const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: metadata?.description || 'Payment',
            custom_id: idempotencyKey,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_selected: 'PAYPAL',
              return_url: returnUrl || successUrl,
              cancel_url: returnUrl || cancelUrl,
            },
          },
        },
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': idempotencyKey,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`PayPal order creation failed: ${error}`);
      }

      const order = await response.json() as { id: string; status: string; links: Array<{ href: string; rel: string }> };
      const approvalLink = order.links?.find((link) => link.rel === 'approve');

      return {
        success: true,
        transactionId: order.id,
        externalId: order.id,
        gateway: this.type,
        gatewayResponse: order,
        paymentUrl: approvalLink?.href,
        status: TransactionStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`PayPal payment creation failed: ${error}`);
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
    try {
      const transmissionId = headers['paypal-transmission-id'];
      const transmissionTime = headers['paypal-transmission-time'];
      const certUrl = headers['paypal-cert-url'];
      const authAlgo = headers['paypal-auth-algo'];
      const transmissionSig = headers['paypal-transmission-sig'];
      const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');

      if (!webhookId) {
        return { valid: false, error: 'Missing PAYPAL_WEBHOOK_ID' };
      }

      if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
        return { valid: false, error: 'Missing PayPal webhook headers' };
      }

      const webhookEvent = typeof payload === 'string'
        ? JSON.parse(payload) as Record<string, unknown>
        : payload;
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: webhookEvent,
        }),
      });

      if (!response.ok) {
        return { valid: false, error: `PayPal webhook verification failed: ${response.statusText}` };
      }

      const verification = await response.json() as { verification_status?: string };

      return {
        valid: verification.verification_status === 'SUCCESS',
        eventId: webhookEvent.id as string || transmissionId,
        eventType: webhookEvent.event_type as string || 'unknown',
        payload: webhookEvent,
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
      const token = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${transactionExternalId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            value: amount.toFixed(2),
            currency_code: 'USD',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`PayPal refund failed: ${error}`);
      }

      const refund = await response.json() as { id: string; status: string };

      return {
        success: true,
        refundId: refund.id,
        externalRefundId: refund.id,
        status: refund.status === 'COMPLETED' ? RefundStatus.COMPLETED : RefundStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`PayPal refund failed: ${error}`);
      return {
        success: false,
        status: RefundStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${externalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get PayPal order: ${response.statusText}`);
      }

      const order = await response.json() as { id: string; status: string };

      return {
        success: order.status === 'COMPLETED',
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
      CREATED: TransactionStatus.PENDING,
      SAVED: TransactionStatus.PENDING,
      APPROVED: TransactionStatus.PENDING,
      VOIDED: TransactionStatus.FAILED,
      COMPLETED: TransactionStatus.COMPLETED,
    };
    return statusMap[gatewayStatus] || TransactionStatus.PENDING;
  }
}
