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
export class BkashGateway implements IGateway {
  private readonly logger = new Logger(BkashGateway.name);
  readonly type = GatewayType.BKASH;
  readonly name = 'bKash (Bangladesh)';

  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly merchantId: string;
  private readonly username: string;
  private readonly password: string;
  private readonly baseUrl: string;
  private accessToken: string | null = null;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BKASH_API_KEY') || '';
    this.apiSecret = this.configService.get<string>('BKASH_API_SECRET') || '';
    this.merchantId = this.configService.get<string>('BKASH_MERCHANT_ID') || '';
    this.username = this.configService.get<string>('BKASH_USERNAME') || '';
    this.password = this.configService.get<string>('BKASH_PASSWORD') || '';
    this.baseUrl = this.configService.get<string>('BKASH_BASE_URL') || 'https://checkout.sandbox.bka.sh/v1.2.0-beta';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const response = await fetch(`${this.baseUrl}/checkout/token/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_key: this.apiKey,
        app_secret: this.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`bKash auth failed: ${response.statusText}`);
    }

    const data = await response.json() as { id_token: string };
    this.accessToken = data.id_token;
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
      const callbackUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'return', gateway: this.type },
      );

      const response = await fetch(`${this.baseUrl}/checkout/payment/create`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          'x-app-key': this.apiKey,
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: currency || 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: idempotencyKey,
          merchantAssociationPayload: JSON.stringify({ idempotencyKey, ...metadata }),
          callbackURL: returnUrl || callbackUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`bKash payment creation failed: ${error}`);
      }

      const payment = await response.json() as { payment_id: string; status: string; trx_id?: string; payment_url?: string };

      return {
        success: payment.status === 'success',
        transactionId: payment.payment_id,
        externalId: payment.payment_id,
        gateway: this.type,
        gatewayResponse: payment,
        paymentUrl: payment.payment_url,
        status: payment.status === 'success' ? TransactionStatus.PENDING : TransactionStatus.FAILED,
        message: payment.status === 'success' ? 'bKash payment initiated' : payment.status,
      };
    } catch (error) {
      this.logger.error(`bKash payment creation failed: ${error}`);
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
    const response = await this.executePaymentStatus(
      (payload as Record<string, unknown>).payment_id as string,
    );

    return {
      valid: response.success,
      eventId: (payload as Record<string, unknown>).trx_id as string,
      eventType: (payload as Record<string, unknown>).status as string,
      payload,
    };
  }

  private async executePaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/checkout/payment/execute`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          'x-app-key': this.apiKey,
        },
        body: JSON.stringify({ payment_id: paymentId }),
      });

      const data = await response.json() as { status: string; trx_id?: string };
      return {
        success: data.status === 'success',
        gateway: this.type,
        status: data.status === 'success' ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
      };
    } catch {
      return {
        success: false,
        gateway: this.type,
        status: TransactionStatus.FAILED,
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

      const response = await fetch(`${this.baseUrl}/checkout/payment/refund`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          'x-app-key': this.apiKey,
        },
        body: JSON.stringify({
          payment_id: transactionExternalId,
          amount: amount.toString(),
          trx_id: transactionExternalId,
          reason: reason || 'Customer requested refund',
        }),
      });

      const refund = await response.json() as { status: string; refund_trx_id?: string };

      return {
        success: refund.status === 'success',
        refundId: refund.refund_trx_id,
        externalRefundId: refund.refund_trx_id,
        status: refund.status === 'success' ? RefundStatus.COMPLETED : RefundStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`bKash refund failed: ${error}`);
      return {
        success: false,
        status: RefundStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return this.executePaymentStatus(externalId);
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    const statusMap: Record<string, TransactionStatus> = {
      success: TransactionStatus.COMPLETED,
      pending: TransactionStatus.PENDING,
      failed: TransactionStatus.FAILED,
    };
    return statusMap[gatewayStatus.toLowerCase()] || TransactionStatus.PENDING;
  }
}
