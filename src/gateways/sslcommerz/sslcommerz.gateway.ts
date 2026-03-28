import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  GatewayType,
  PaymentCustomer,
  PaymentMetadata,
  PaymentResponse,
  RefundResponse,
  RefundStatus,
  TransactionStatus,
  WebhookVerificationResult,
} from "../../common/types";
import { IGateway } from "../interfaces/gateway.interface";
import { buildPublicAppUrl } from "../utils/public-app-url.util";

@Injectable()
export class SslCommerzGateway implements IGateway {
  private readonly logger = new Logger(SslCommerzGateway.name);
  readonly type = GatewayType.SSLCOMMERZ;
  readonly name = "SSLCommerz (Bangladesh)";

  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storeId = this.configService.get<string>("SSLCOMMERZ_STORE_ID") || "";
    this.storePassword =
      this.configService.get<string>("SSLCOMMERZ_STORE_PASSWORD") || "";
    this.baseUrl =
      this.configService.get<string>("SSLCOMMERZ_BASE_URL") ||
      "https://sandbox.sslcommerz.com";
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
        "/webhooks/sslcommerz",
        this.configService.get<string>("APP_URL"),
      );
      const response = await fetch(`${this.baseUrl}/gw/v3/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: this.storeId,
          store_passwd: this.storePassword,
          total_amount: amount,
          currency: currency || "BDT",
          tran_id: idempotencyKey,
          success_url: returnUrl || webhookUrl,
          fail_url: returnUrl || webhookUrl,
          cancel_url: returnUrl || webhookUrl,
          cus_email: customer.email,
          cus_phone: customer.phone,
          product_profile: "general",
        }),
      });

      const data = (await response.json()) as {
        status: string;
        sessionkey?: string;
        gatewaypage_url?: string;
      };
      return {
        success: data.status === "success",
        transactionId: data.sessionkey || idempotencyKey,
        externalId: idempotencyKey,
        gateway: this.type,
        gatewayResponse: data,
        paymentUrl: data.gatewaypage_url,
        status:
          data.status === "success"
            ? TransactionStatus.PENDING
            : TransactionStatus.FAILED,
      };
    } catch (error) {
      this.logger.error(`SSLCommerz payment failed: ${error}`);
      return {
        success: false,
        gateway: this.type,
        status: TransactionStatus.FAILED,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async verifyWebhook(
    payload: string | Record<string, unknown>,
    headers: Record<string, string>,
  ): Promise<WebhookVerificationResult> {
    return {
      valid: true,
      eventId: (payload as Record<string, unknown>).tran_id as string,
      eventType: (payload as Record<string, unknown>).status as string,
      payload,
    };
  }

  async createRefund(
    transactionExternalId: string,
    amount: number,
    reason?: string,
  ): Promise<RefundResponse> {
    return {
      success: false,
      status: RefundStatus.FAILED,
      message: "SSLCommerz refund not implemented",
    };
  }

  async getPaymentStatus(externalId: string): Promise<PaymentResponse> {
    return {
      success: false,
      gateway: this.type,
      status: TransactionStatus.PENDING,
    };
  }

  mapStatus(gatewayStatus: string): TransactionStatus {
    return gatewayStatus === "success"
      ? TransactionStatus.COMPLETED
      : TransactionStatus.PENDING;
  }
}
