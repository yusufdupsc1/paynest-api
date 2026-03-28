import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import { GatewayType, TransactionStatus, RefundStatus, PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../../common/types';
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';

@Injectable()
export class AdyenGateway implements IGateway {
  private readonly logger = new Logger(AdyenGateway.name);
  readonly type = GatewayType.ADYEN;
  readonly name = 'Adyen (Global)';

  private readonly apiKey: string;
  private readonly merchantAccount: string;
  private readonly baseUrl = 'https://checkout-test.adyen.com/v71';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ADYEN_API_KEY') || '';
    this.merchantAccount = this.configService.get<string>('ADYEN_MERCHANT_ACCOUNT') || '';
  }

  async createPayment(amount: number, currency: string, customer: PaymentCustomer, idempotencyKey: string, metadata?: PaymentMetadata, returnUrl?: string): Promise<PaymentResponse> {
    try {
      const adyenReturnUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'return', gateway: this.type },
      );
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          amount: { value: Math.round(amount * 100), currency: currency || 'USD' },
          reference: idempotencyKey,
          merchantAccount: this.merchantAccount,
          returnUrl: returnUrl || adyenReturnUrl,
          shopperEmail: customer.email,
          shopperReference: customer.phone,
          metadata: metadata,
        }),
      });

      const data = await response.json() as { resultCode: string; pspReference?: string; action?: { paymentMethodType: string; url: string } };
      return {
        success: data.resultCode === 'Authorised' || data.resultCode === 'Pending',
        transactionId: data.pspReference || idempotencyKey,
        externalId: data.pspReference || idempotencyKey,
        gateway: this.type,
        gatewayResponse: data,
        paymentUrl: data.action?.url,
        status: data.resultCode === 'Authorised' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`Adyen payment failed: ${error}`);
      return { success: false, gateway: this.type, status: TransactionStatus.FAILED, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyWebhook(payload: string | Record<string, unknown>, headers: Record<string, string>): Promise<WebhookVerificationResult> {
    return { valid: true, eventId: (payload as Record<string, unknown>)?.pspReference as string, eventType: (payload as Record<string, unknown>)?.eventCode as string, payload };
  }

  async createRefund(transactionExternalId: string, amount: number, reason?: string): Promise<RefundResponse> {
    return { success: false, status: RefundStatus.FAILED, message: 'Adyen refund not implemented' };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return { success: false, gateway: this.type, status: TransactionStatus.PENDING };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === 'Authorised' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
  }
}
