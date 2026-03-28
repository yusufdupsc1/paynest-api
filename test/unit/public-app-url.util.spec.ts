import {
  buildHostedDashboardUrl,
  buildPublicAppUrl,
  resolvePublicAppUrl,
} from "../../src/gateways/utils/public-app-url.util";

describe("public app URL utilities", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("falls back to localhost when APP_URL is not provided", () => {
    process.env.NODE_ENV = "test";

    expect(resolvePublicAppUrl()).toBe("http://localhost:3000");
    expect(buildPublicAppUrl("/webhooks/stripe")).toBe(
      "http://localhost:3000/webhooks/stripe",
    );
  });

  it("throws when APP_URL is missing in production", () => {
    process.env.NODE_ENV = "production";

    expect(() => resolvePublicAppUrl()).toThrow(
      "APP_URL must be configured in production",
    );
  });

  it("throws when APP_URL is malformed", () => {
    expect(() => resolvePublicAppUrl("paynest.example.com")).toThrow(
      "APP_URL must be a valid absolute public URL",
    );
  });

  it("normalizes a valid public app URL before building paths", () => {
    expect(
      buildPublicAppUrl("/webhooks/paypal", "https://paynest.example.com/"),
    ).toBe("https://paynest.example.com/webhooks/paypal");
  });

  it("builds hosted dashboard URLs on the served root path", () => {
    expect(
      buildHostedDashboardUrl("https://paynest.example.com/", {
        checkout: "success",
        gateway: "stripe",
      }),
    ).toBe("https://paynest.example.com/?checkout=success&gateway=stripe");
  });
});
