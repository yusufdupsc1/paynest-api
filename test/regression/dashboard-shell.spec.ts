import { readFileSync } from "fs";
import { join } from "path";

describe("Dashboard shell regression", () => {
  it("retains the operational multi-view sections and deeper portfolio data hooks", () => {
    const html = readFileSync(
      join(process.cwd(), "public", "index.html"),
      "utf8",
    );

    expect(html).toContain('id="transactions-view"');
    expect(html).toContain('id="webhooks-view"');
    expect(html).toContain('id="reliability-view"');
    expect(html).toContain("/health");
    expect(html).toContain("/webhooks?limit=20");
    expect(html).toContain("/webhooks/${webhookId}");
    expect(html).toContain('id="webhookSignatureFilter"');
    expect(html).toContain('id="webhookReplayableFilter"');
    expect(html).toContain('id="gateways-view"');
    expect(html).toContain('id="refunds-view"');
    expect(html).toContain('id="analytics-view"');
    expect(html).toContain("Feed summary");
    expect(html).toContain("Recent reliability timestamps");
    expect(html).toContain("Recent 24h reliability flow");
    expect(html).toContain("Replay and reliability context");
    expect(html).toContain("Reliability scorecard");
    expect(html).toContain("Transaction queue");
    expect(html).toContain("Gateway support matrix");
    expect(html).toContain("Recent refund queue");
    expect(html).toContain("Recent trend bars");
    expect(html).toContain("/refunds?limit=8");
    expect(html).toContain("/refunds/stats");
    expect(html).toContain("/analytics/trends?days=14");
    expect(html).toContain(
      "required transactions, analytics, health, refunds, and webhooks endpoints",
    );
    expect(html).toContain("live backend signals");
  });
});
