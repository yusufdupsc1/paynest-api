import { Injectable } from '@nestjs/common';
import { IGateway } from './interfaces/gateway.interface';
import { GatewayType, PaymentCustomer, PaymentMetadata, PaymentResponse, RefundResponse, WebhookVerificationResult } from '../common/types';
import { StripeGateway } from './stripe/stripe.gateway';
import { PayPalGateway } from './paypal/paypal.gateway';
import { BkashGateway } from './bkash/bkash.gateway';
import { NagadGateway } from './nagad/nagad.gateway';
import { RazorpayGateway } from './razorpay/razorpay.gateway';
import { MercadopagoGateway } from './mercadopago/mercadopago.gateway';
import { FlutterwaveGateway } from './flutterwave/flutterwave.gateway';
import { PaystackGateway } from './paystack/paystack.gateway';
import { SquareGateway } from './square/square.gateway';
import { AdyenGateway } from './adyen/adyen.gateway';

@Injectable()
export class GatewayService {
  private readonly gateways = new Map<GatewayType, IGateway>();

  constructor(
    private readonly stripeGateway: StripeGateway,
    private readonly paypalGateway: PayPalGateway,
    private readonly bkashGateway: BkashGateway,
    private readonly nagadGateway: NagadGateway,
    private readonly razorpayGateway: RazorpayGateway,
    private readonly mercadopagoGateway: MercadopagoGateway,
    private readonly flutterwaveGateway: FlutterwaveGateway,
    private readonly paystackGateway: PaystackGateway,
    private readonly squareGateway: SquareGateway,
    private readonly adyenGateway: AdyenGateway,
  ) {
    this.gateways.set(GatewayType.STRIPE, this.stripeGateway);
    this.gateways.set(GatewayType.PAYPAL, this.paypalGateway);
    this.gateways.set(GatewayType.BKASH, this.bkashGateway);
    this.gateways.set(GatewayType.NAGAD, this.nagadGateway);
    this.gateways.set(GatewayType.RAZORPAY, this.razorpayGateway);
    this.gateways.set(GatewayType.MERCADOPAGO, this.mercadopagoGateway);
    this.gateways.set(GatewayType.FLUTTERWAVE, this.flutterwaveGateway);
    this.gateways.set(GatewayType.PAYSTACK, this.paystackGateway);
    this.gateways.set(GatewayType.SQUARE, this.squareGateway);
    this.gateways.set(GatewayType.ADYEN, this.adyenGateway);
  }

  getGateway(type: GatewayType): IGateway {
    const gateway = this.gateways.get(type);
    if (!gateway) {
      throw new Error(`Gateway ${type} is not supported`);
    }
    return gateway;
  }

  async createPayment(
    gatewayType: GatewayType,
    amount: number,
    currency: string,
    customer: PaymentCustomer,
    idempotencyKey: string,
    metadata?: PaymentMetadata,
    returnUrl?: string,
  ): Promise<PaymentResponse> {
    const gateway = this.getGateway(gatewayType);
    return gateway.createPayment(amount, currency, customer, idempotencyKey, metadata, returnUrl);
  }

  async verifyWebhook(
    gatewayType: GatewayType,
    payload: string | Record<string, unknown>,
    headers: Record<string, string>,
  ): Promise<WebhookVerificationResult> {
    const gateway = this.getGateway(gatewayType);
    return gateway.verifyWebhook(payload, headers);
  }

  async createRefund(
    gatewayType: GatewayType,
    transactionExternalId: string,
    amount: number,
    reason?: string,
    idempotencyKey?: string,
  ): Promise<RefundResponse> {
    const gateway = this.getGateway(gatewayType);
    return gateway.createRefund(transactionExternalId, amount, reason, idempotencyKey);
  }

  getSupportedGateways(): Array<{ type: GatewayType; name: string }> {
    return Array.from(this.gateways.entries()).map(([type, gateway]) => ({
      type,
      name: gateway.name,
    }));
  }
}
