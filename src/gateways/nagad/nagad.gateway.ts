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
export class NagadGateway implements IGateway {
  private readonly logger = new Logger(NagadGateway.name);
  readonly type = GatewayType.NAGAD;
  readonly name = 'Nagad (Bangladesh)';

  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly configService: ConfigService) {
    this.merchantId = this.configService.get<string>('NAGAD_MERCHANT_ID') || '';
    this.merchantKey = this.configService.get<string>('NAGAD_MERCHANT_KEY') || '';
    this.baseUrl = this.configService.get<string>('NAGAD_BASE_URL') || 'https://sandbox.mynagad.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.configService.get<string>('NAGAD_USERNAME'),
        password: this.configService.get<string>('NAGAD_PASSWORD'),
      }),
    });

    if (!response.ok) {
      throw new Error(`Nagad auth failed: ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string; expires_at: string };
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(data.expires_at);
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
      const dateTime = new Date().toISOString();

      const response = await fetch(`${this.baseUrl}/api/auth/checkout/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-KM-IP-V4': '127.0.0.1',
          'X-KM-Api-Key': this.merchantKey,
          'X-KM-Client-Id': this.merchantId,
          'X-KM-Request-Timestamp': dateTime,
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: currency || 'BDT',
          orderId: idempotencyKey,
          additionalData: JSON.stringify(metadata),
          callbackUrl: returnUrl || callbackUrl,
          merchantId: this.merchantId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Nagad payment creation failed: ${error}`);
      }

      const payment = await response.json() as { paymentReferenceId: string; status: string; paymentUrl?: string };

      return {
        success: payment.status === 'success',
        transactionId: payment.paymentReferenceId,
        externalId: payment.paymentReferenceId,
        gateway: this.type,
        gatewayResponse: payment,
        paymentUrl: payment.paymentUrl,
        status: payment.status === 'success' ? TransactionStatus.PENDING : TransactionStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Nagad payment creation failed: ${error}`);
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
    return {
      valid: true,
      eventId: (payload as Record<string, unknown>).paymentRefId as string,
      eventType: (payload as Record<string, unknown>).status as string,
      payload,
    };
  }

  async createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
  ): Promise<RefundResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/api/auth/checkout/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-KM-IP-V4': '127.0.0.1',
          'X-KM-Api-Key': this.merchantKey,
        },
        body: JSON.stringify({
          paymentRefId: transactionExternalId,
          amount: amount.toString(),
          reason: reason || 'Customer requested refund',
        }),
      });

      const refund = await response.json() as { status: string; refundRefId?: string };

      return {
        success: refund.status === 'success',
        refundId: refund.refundRefId,
        externalRefundId: refund.refundRefId,
        status: refund.status === 'success' ? RefundStatus.COMPLETED : RefundStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Nagad refund failed: ${error}`);
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
      const response = await fetch(`${this.baseUrl}/api/auth/checkout/payment/verify/${externalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-KM-IP-V4': '127.0.0.1',
          'X-KM-Api-Key': this.merchantKey,
        },
      });

      const data = await response.json() as { status: string };
      return {
        success: data.status === 'success',
        externalId,
        gateway: this.type,
        status: this.mapStatus(data.status),
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
      success: TransactionStatus.COMPLETED,
      pending: TransactionStatus.PENDING,
      failed: TransactionStatus.FAILED,
    };
    return statusMap[gatewayStatus.toLowerCase()] || TransactionStatus.PENDING;
  }
}
