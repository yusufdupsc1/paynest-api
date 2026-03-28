import { ConfigService } from "@nestjs/config";
import { AamarpayGateway } from "../../src/gateways/aamarpay/aamarpay.gateway";
import { SslCommerzGateway } from "../../src/gateways/sslcommerz/sslcommerz.gateway";

describe("hosted callback URL gateways", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("keeps Aamarpay default callbacks pointed at the webhook endpoint", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ status: "success", payment_url: "https://pay.example/checkout" }),
    });
    global.fetch = fetchMock as typeof fetch;

    const gateway = new AamarpayGateway(
      {
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            APP_URL: "https://paynest.example.com",
            AAMARPAY_STORE_ID: "store-id",
            AAMARPAY_SIGNATURE_KEY: "signature-key",
            AAMARPAY_BASE_URL: "https://sandbox.aamarpay.com",
          };

          return config[key] ?? "";
        }),
      } as unknown as ConfigService,
    );

    await gateway.createPayment(
      125,
      "BDT",
      { email: "demo@example.com", phone: "8801000000000", name: "Demo" },
      "idem-aamarpay-001",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://sandbox.aamarpay.com/post",
      expect.objectContaining({
        body: expect.any(URLSearchParams),
      }),
    );

    const request = fetchMock.mock.calls[0]?.[1] as { body: URLSearchParams };
    expect(request.body.get("success_url")).toBe(
      "https://paynest.example.com/webhooks/aamarpay",
    );
    expect(request.body.get("fail_url")).toBe(
      "https://paynest.example.com/webhooks/aamarpay",
    );
  });

  it("keeps SSLCommerz default callbacks pointed at the webhook endpoint", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ status: "success", sessionkey: "session-001" }),
    });
    global.fetch = fetchMock as typeof fetch;

    const gateway = new SslCommerzGateway(
      {
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            APP_URL: "https://paynest.example.com",
            SSLCOMMERZ_STORE_ID: "store-id",
            SSLCOMMERZ_STORE_PASSWORD: "store-password",
            SSLCOMMERZ_BASE_URL: "https://sandbox.sslcommerz.com",
          };

          return config[key] ?? "";
        }),
      } as unknown as ConfigService,
    );

    await gateway.createPayment(
      200,
      "BDT",
      { email: "demo@example.com", phone: "8801000000000", name: "Demo" },
      "idem-sslcommerz-001",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://sandbox.sslcommerz.com/gw/v3/process",
      expect.objectContaining({
        body: expect.any(String),
      }),
    );

    const request = fetchMock.mock.calls[0]?.[1] as { body: string };
    const parsedBody = JSON.parse(request.body) as Record<string, string>;

    expect(parsedBody.success_url).toBe(
      "https://paynest.example.com/webhooks/sslcommerz",
    );
    expect(parsedBody.fail_url).toBe(
      "https://paynest.example.com/webhooks/sslcommerz",
    );
    expect(parsedBody.cancel_url).toBe(
      "https://paynest.example.com/webhooks/sslcommerz",
    );
  });
});
