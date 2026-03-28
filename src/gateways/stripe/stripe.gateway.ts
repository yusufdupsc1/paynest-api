import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { IGateway } from '../interfaces/gateway.interface';
import { buildHostedDashboardUrl } from '../utils/public-app-url.util';
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

@Injectable()
export class StripeGateway implements IGateway {
  private readonly logger = new Logger(StripeGateway.name);
  readonly type = GatewayType.STRIPE;
  readonly name = 'Stripe';

  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_API_KEY');
    if (!apiKey) {
      throw new Error('STRIPE_API_KEY is not configured');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
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
      const successUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'success' },
      );
      const cancelUrl = buildHostedDashboardUrl(
        this.configService.get<string>('APP_URL'),
        { checkout: 'cancel' },
      );
      const session = await this.stripe.checkout.sessions.create(
        {
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: metadata?.description || 'Payment',
                },
                unit_amount: Math.round(amount * 100),
              },
              quantity: 1,
            },
          ],
          customer_email: customer.email,
          metadata: {
            idempotencyKey,
            ...metadata,
          },
          success_url: returnUrl || successUrl,
          cancel_url: returnUrl || cancelUrl,
        },
        {
          idempotencyKey,
        },
      );

      return {
        success: true,
        transactionId: session.id || '',
        externalId: session.id || '',
        gateway: this.type,
        gatewayResponse: session,
        paymentUrl: session.url || undefined,
        status: TransactionStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`Stripe payment creation failed: ${error}`);
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
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return { valid: false, error: 'Webhook secret not configured' };
    }

    try {
      const sigHeader = headers['stripe-signature'];
      if (!sigHeader) {
        return { valid: false, error: 'Missing stripe-signature header' };
      }

      let event: Stripe.Event;
      if (typeof payload === 'string') {
        event = this.stripe.webhooks.constructEvent(
          payload,
          sigHeader,
          webhookSecret,
        );
      } else {
        event = this.stripe.webhooks.constructEvent(
          JSON.stringify(payload),
          sigHeader,
          webhookSecret,
        );
      }

      return {
        valid: true,
        eventId: event.id,
        eventType: event.type,
        payload: event.data.object,
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
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionExternalId,
        amount: Math.round(amount * 100),
        reason: 'requested_by_customer',
      });

      return {
        success: true,
        refundId: refund.id,
        externalRefundId: refund.id,
        status: refund.status === 'succeeded' ? RefundStatus.COMPLETED : RefundStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`Stripe refund failed: ${error}`);
      return {
        success: false,
        status: RefundStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(externalId);
      return {
        success: session.payment_status === 'paid',
        externalId: session.id || externalId,
        gateway: this.type,
        status: this.mapStatus(session.status || 'unknown'),
        gatewayResponse: session,
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
      pending: TransactionStatus.PENDING,
      complete: TransactionStatus.COMPLETED,
      paid: TransactionStatus.COMPLETED,
      succeeded: TransactionStatus.COMPLETED,
      failed: TransactionStatus.FAILED,
      canceled: TransactionStatus.FAILED,
      expired: TransactionStatus.FAILED,
    };
    return statusMap[gatewayStatus.toLowerCase()] || TransactionStatus.PENDING;
  }
}
