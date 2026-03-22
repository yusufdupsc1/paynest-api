import {
  GatewayType,
  RefundStatus,
  TransactionStatus,
} from "../../src/common/types";
import { CreateRefundDto } from "../../src/modules/refunds/refunds.service";
import { CreatePaymentDto } from "../../src/modules/transactions/transactions.service";

export const canonicalPaymentRequest: CreatePaymentDto = {
  gateway: GatewayType.STRIPE,
  amount: 125.5,
  currency: "USD",
  customer: {
    email: "ops@paynest.dev",
    phone: "+8801700000000",
    name: "Reliability Lead",
  },
  idempotencyKey: "idem-test-001",
  metadata: {
    orderId: "order-1001",
    reliabilityRunbook: true,
  },
  returnUrl: "https://paynest.dev/return",
};

export const canonicalRefundRequest: CreateRefundDto = {
  transactionId: "txn-001",
  amount: 50,
  reason: "operator_requested_partial_refund",
};

export const canonicalPaymentResponse = {
  success: true,
  gateway: GatewayType.STRIPE,
  externalId: "pi_test_001",
  status: TransactionStatus.PENDING,
  paymentUrl: "https://checkout.stripe.test/session_001",
  gatewayResponse: {
    checkoutSessionId: "cs_test_001",
  },
};

export const canonicalRefundGatewayResponse = {
  success: true,
  externalRefundId: "re_test_001",
  status: RefundStatus.COMPLETED,
};
