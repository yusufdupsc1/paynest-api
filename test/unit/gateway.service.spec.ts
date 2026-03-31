import { GatewayService } from '../../src/gateways/gateway.service';
import { StripeGateway } from '../../src/gateways/stripe/stripe.gateway';
import { PayPalGateway } from '../../src/gateways/paypal/paypal.gateway';
import { GatewayType } from '../../src/common/types';

describe('GatewayService', () => {
  let service: GatewayService;
  let stripeGateway: jest.Mocked<Pick<StripeGateway, 'type' | 'name' | 'createPayment' | 'verifyWebhook' | 'createRefund'>>;
  let paypalGateway: jest.Mocked<Pick<PayPalGateway, 'type' | 'name' | 'createPayment' | 'verifyWebhook' | 'createRefund'>>;

  beforeEach(() => {
    stripeGateway = {
      type: GatewayType.STRIPE,
      name: 'Stripe',
      createPayment: jest.fn(),
      verifyWebhook: jest.fn(),
      createRefund: jest.fn(),
    };
    paypalGateway = {
      type: GatewayType.PAYPAL,
      name: 'PayPal',
      createPayment: jest.fn(),
      verifyWebhook: jest.fn(),
      createRefund: jest.fn(),
    };

    service = new GatewayService(
      stripeGateway as never,
      paypalGateway as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
  });

  describe('getGateway', () => {
    it('returns the correct gateway for STRIPE', () => {
      const gateway = service.getGateway(GatewayType.STRIPE);
      expect(gateway.name).toBe('Stripe');
    });

    it('returns the correct gateway for PAYPAL', () => {
      const gateway = service.getGateway(GatewayType.PAYPAL);
      expect(gateway.name).toBe('PayPal');
    });

    it('throws error for unsupported gateway type', () => {
      expect(() => service.getGateway('unknown' as GatewayType)).toThrow('Gateway unknown is not supported');
    });
  });

  describe('createPayment', () => {
    it('delegates to the correct gateway', async () => {
      stripeGateway.createPayment.mockResolvedValue({
        success: true,
        gateway: GatewayType.STRIPE,
        status: 'pending' as never,
      });

      await service.createPayment(
        GatewayType.STRIPE,
        100,
        'USD',
        { email: 'test@test.com', phone: '+1234567890' },
        'idem-key',
      );

      expect(stripeGateway.createPayment).toHaveBeenCalledWith(
        100,
        'USD',
        { email: 'test@test.com', phone: '+1234567890' },
        'idem-key',
        undefined,
        undefined,
      );
    });
  });

  describe('verifyWebhook', () => {
    it('delegates verification to the correct gateway', async () => {
      stripeGateway.verifyWebhook.mockResolvedValue({
        valid: true,
        eventId: 'evt-1',
        eventType: 'payment_intent.succeeded',
      });

      const result = await service.verifyWebhook(
        GatewayType.STRIPE,
        '{"id":"evt-1"}',
        { 'stripe-signature': 'sig' },
      );

      expect(result.valid).toBe(true);
      expect(stripeGateway.verifyWebhook).toHaveBeenCalled();
    });
  });

  describe('createRefund', () => {
    it('delegates refund to the correct gateway', async () => {
      stripeGateway.createRefund.mockResolvedValue({
        success: true,
        status: 'completed' as never,
      });

      await service.createRefund(GatewayType.STRIPE, 'ext-123', 50, 'customer request');

      expect(stripeGateway.createRefund).toHaveBeenCalledWith('ext-123', 50, 'customer request');
    });
  });

  describe('getSupportedGateways', () => {
    it('returns list of all supported gateways', () => {
      const gateways = service.getSupportedGateways();

      expect(gateways).toEqual(
        expect.arrayContaining([
          { type: GatewayType.STRIPE, name: 'Stripe' },
          { type: GatewayType.PAYPAL, name: 'PayPal' },
        ]),
      );
      expect(gateways.length).toBeGreaterThanOrEqual(2);
    });
  });
});
