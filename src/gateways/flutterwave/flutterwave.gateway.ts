import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import { GatewayType, TransactionStatus, RefundStatus, PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../../common/types';
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';

@Injectable()
export class FlutterwaveGateway implements IGateway {
  private readonly logger = new Logger(FlutterwaveGateway.name);
  readonly type = GatewayType.FLUTTERWAVE;
  readonly name = 'Flutterwave (Africa)';

  private readonly publicKey: string;
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.flutterwave.com/v3';

  constructor(private readonly configService: ConfigService) {
    this.publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY') || '';
    this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY') || '';
  }

  async createPayment(amount: number, currency: string, customer: PaymentCustomer, idempotencyKey: string, metadata?: PaymentMetadata, returnUrl?: string): Promise<PaymentResponse> {
    try {
      const redirectUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'return', gateway: this.type },
      );
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: idempotencyKey,
          amount: amount.toString(),
          currency: currency || 'USD',
          redirect_url: returnUrl || redirectUrl,
          customer: { email: customer.email, phonenumber: customer.phone, name: customer.name },
          meta: metadata,
        }),
      });

      const data = await response.json() as { status: string; data?: { link?: string; id?: string } };
      return {
        success: data.status === 'success',
        transactionId: data.data?.id?.toString() || idempotencyKey,
        externalId: data.data?.id?.toString() || idempotencyKey,
        gateway: this.type,
        gatewayResponse: data,
        paymentUrl: data.data?.link,
        status: data.status === 'success' ? TransactionStatus.PENDING : TransactionStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`Flutterwave payment failed: ${error}`);
      return { success: false, gateway: this.type, status: TransactionStatus.FAILED, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyWebhook(payload: string | Record<string, unknown>, headers: Record<string, string>): Promise<WebhookVerificationResult> {
    return { valid: true, eventId: (payload as Record<string, unknown>).tx_ref as string, eventType: (payload as Record<string, unknown>).status as string, payload };
  }

  async createRefund(transactionExternalId: string, amount: number, reason?: string): Promise<RefundResponse> {
    return { success: false, status: RefundStatus.FAILED, message: 'Flutterwave refund not implemented' };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return { success: false, gateway: this.type, status: TransactionStatus.PENDING };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === 'successful' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
  }
}
