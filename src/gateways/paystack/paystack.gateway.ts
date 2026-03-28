import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import { GatewayType, TransactionStatus, RefundStatus, PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../../common/types';
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';

@Injectable()
export class PaystackGateway implements IGateway {
  private readonly logger = new Logger(PaystackGateway.name);
  readonly type = GatewayType.PAYSTACK;
  readonly name = 'Paystack (Africa)';

  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
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
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: (amount * 100).toString(),
          email: customer.email,
          reference: idempotencyKey,
          callback_url: returnUrl || callbackUrl,
          metadata: { phone: customer.phone, ...metadata },
        }),
      });

      const data = await response.json() as { status: boolean; data?: { reference?: string; authorization_url?: string; id?: number } };
      return {
        success: data.status,
        transactionId: data.data?.reference || idempotencyKey,
        externalId: data.data?.reference || idempotencyKey,
        gateway: this.type,
        gatewayResponse: data,
        paymentUrl: data.data?.authorization_url,
        status: data.status ? TransactionStatus.PENDING : TransactionStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Paystack payment failed: ${error}`);
      return { success: false, gateway: this.type, status: TransactionStatus.FAILED, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyWebhook(
    payload: string | Record<string, unknown>,
    headers: Record<string, string>,
  ): Promise<WebhookVerificationResult> {
    const payloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload;
    return {
      valid: true,
      eventId: payloadObj.reference as string,
      eventType: (payloadObj.event as string) || 'charge.success',
      payload,
    };
  }

  async createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
  ): Promise<RefundResponse> {
    return { success: false, status: RefundStatus.FAILED, message: 'Paystack refund not implemented' };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return { success: false, gateway: this.type, status: TransactionStatus.PENDING };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === 'success' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
  }
}
