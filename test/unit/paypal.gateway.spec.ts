import { ConfigService } from '@nestjs/config';
import { PayPalGateway } from '../../src/gateways/paypal/paypal.gateway';

describe('PayPalGateway', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('verifies PayPal webhooks with the PayPal signature verification API', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'access-token', expires_in: 3600 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ verification_status: 'SUCCESS' }),
      });
    const gateway = new PayPalGateway(configService());
    const payload = { id: 'WH-123', event_type: 'PAYMENT.CAPTURE.COMPLETED' };

    const result = await gateway.verifyWebhook(payload, paypalHeaders());

    expect(result).toEqual({
      valid: true,
      eventId: 'WH-123',
      eventType: 'PAYMENT.CAPTURE.COMPLETED',
      payload,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer access-token' }),
        body: JSON.stringify({
          auth_algo: 'SHA256withRSA',
          cert_url: 'https://api-m.sandbox.paypal.com/certs/cert.pem',
          transmission_id: 'transmission-123',
          transmission_sig: 'signature-123',
          transmission_time: '2026-05-01T06:00:00Z',
          webhook_id: 'webhook-id-123',
          webhook_event: payload,
        }),
      }),
    );
  });

  it('rejects PayPal webhooks unless verification status is SUCCESS', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'access-token', expires_in: 3600 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ verification_status: 'FAILURE' }),
      });
    const gateway = new PayPalGateway(configService());

    const result = await gateway.verifyWebhook(
      { id: 'WH-123', event_type: 'PAYMENT.CAPTURE.COMPLETED' },
      paypalHeaders(),
    );

    expect(result.valid).toBe(false);
  });

  it('fails closed when required PayPal webhook configuration is missing', async () => {
    const gateway = new PayPalGateway(configService({ PAYPAL_WEBHOOK_ID: undefined }));

    const result = await gateway.verifyWebhook(
      { id: 'WH-123', event_type: 'PAYMENT.CAPTURE.COMPLETED' },
      paypalHeaders(),
    );

    expect(result).toEqual({ valid: false, error: 'Missing PAYPAL_WEBHOOK_ID' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function paypalHeaders(): Record<string, string> {
  return {
    'paypal-transmission-id': 'transmission-123',
    'paypal-transmission-time': '2026-05-01T06:00:00Z',
    'paypal-cert-url': 'https://api-m.sandbox.paypal.com/certs/cert.pem',
    'paypal-auth-algo': 'SHA256withRSA',
    'paypal-transmission-sig': 'signature-123',
  };
}

function configService(overrides: Record<string, string | undefined> = {}): ConfigService {
  const values: Record<string, string | undefined> = {
    PAYPAL_CLIENT_ID: 'client-id',
    PAYPAL_CLIENT_SECRET: 'client-secret',
    PAYPAL_ENVIRONMENT: 'sandbox',
    PAYPAL_WEBHOOK_ID: 'webhook-id-123',
    ...overrides,
  };

  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}
