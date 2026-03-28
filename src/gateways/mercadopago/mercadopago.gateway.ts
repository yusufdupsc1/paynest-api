import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGateway } from '../interfaces/gateway.interface';
import { GatewayType, TransactionStatus, RefundStatus, PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../../common/types';
import { buildPublicAppUrl } from '../utils/public-app-url.util';

@Injectable()
export class MercadopagoGateway implements IGateway {
  private readonly logger = new Logger(MercadopagoGateway.name);
  readonly type = GatewayType.MERCADOPAGO;
  readonly name = 'Mercado Pago (Latin America)';

  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mercadopago.com';
  private readonly notificationUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') || '';
    this.notificationUrl = buildPublicAppUrl(
      '/webhooks/mercadopago',
      this.configService.get<string>('APP_URL'),
    );
  }

  async createPayment(amount: number, currency: string, customer: PaymentCustomer, idempotencyKey: string, metadata?: PaymentMetadata, returnUrl?: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: amount,
          description: metadata?.description || 'Payment',
          payment_method_id: 'pix',
          payer: { email: customer.email },
          external_reference: idempotencyKey,
          currency_id: currency,
          notification_url: this.notificationUrl,
        }),
      });

      const data = await response.json() as { id: number; status: string; transaction_details?: { payment_url?: string } };
      return {
        success: data.status === 'pending' || data.status === 'approved',
        transactionId: String(data.id),
        externalId: String(data.id),
        gateway: this.type,
        gatewayResponse: data,
        status: data.status === 'approved' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`Mercadopago payment failed: ${error}`);
      return { success: false, gateway: this.type, status: TransactionStatus.FAILED, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyWebhook(payload: string | Record<string, unknown>, headers: Record<string, string>): Promise<WebhookVerificationResult> {
    const payloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload;
    const data = payloadObj.data as { id?: string } | undefined;
    return { valid: true, eventId: data?.id || '', eventType: payloadObj.type as string || '', payload };
  }

  async createRefund(transactionExternalId: string, amount: number, reason?: string): Promise<RefundResponse> {
    return { success: false, status: RefundStatus.FAILED, message: 'Mercadopago refund not implemented' };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return { success: false, gateway: this.type, status: TransactionStatus.PENDING };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === 'approved' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
  }
}
