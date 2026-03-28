import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import { GatewayType, TransactionStatus, RefundStatus } from '../../common/types';
import { PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../../common/types';
import { buildPublicAppUrl } from '../utils/public-app-url.util';

@Injectable()
export class AamarpayGateway implements IGateway {
  private readonly logger = new Logger(AamarpayGateway.name);
  readonly type = GatewayType.AAMARPAY;
  readonly name = 'Aamarpay (Bangladesh)';

  private readonly storeId: string;
  private readonly signatureKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storeId = this.configService.get<string>('AAMARPAY_STORE_ID') || '';
    this.signatureKey = this.configService.get<string>('AAMARPAY_SIGNATURE_KEY') || '';
    this.baseUrl = this.configService.get<string>('AAMARPAY_BASE_URL') || 'https://sandbox.aamarpay.com';
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
      const webhookUrl = buildPublicAppUrl(
        '/webhooks/aamarpay',
        this.configService.get<string>('APP_URL'),
      );
      const response = await fetch(`${this.baseUrl}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          store_id: this.storeId,
          signature_key: this.signatureKey,
          amount: amount.toString(),
          currency: currency || 'BDT',
          tran_id: idempotencyKey,
          success_url: returnUrl || webhookUrl,
          fail_url: returnUrl || webhookUrl,
          customer_email: customer.email,
          customer_mobile: customer.phone,
        }),
      });

      const data = await response.json() as { status: string; payment_url?: string };
      return {
        success: data.status === 'success',
        transactionId: idempotencyKey,
        externalId: idempotencyKey,
        gateway: this.type,
        gatewayResponse: data,
        paymentUrl: data.payment_url,
        status: data.status === 'success' ? TransactionStatus.PENDING : TransactionStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Aamarpay payment failed: ${error}`);
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
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    return {
      valid: true,
      eventId: data.tran_id as string,
      eventType: data.status as string,
      payload,
    };
  }

  async createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
  ): Promise<RefundResponse> {
    return { success: false, status: RefundStatus.FAILED, message: 'Aamarpay refund not implemented' };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return { success: false, gateway: this.type, status: TransactionStatus.PENDING };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === 'success' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
  }
}
