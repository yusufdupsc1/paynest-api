describe("Backend API contract regression", () => {
  it("confirms API routes use /api/v1 prefix", () => {
    const fs = require('fs');
    const mainTs = fs.readFileSync('src/main.ts', 'utf8');

    expect(mainTs).toContain("setGlobalPrefix('api/v1'");
    expect(mainTs).toContain("exclude:");
    expect(mainTs).toContain("'health'");
  });

  it("confirms CORS is configured for cross-origin frontend", () => {
    const fs = require('fs');
    const factoryTs = fs.readFileSync('src/app.factory.ts', 'utf8');

    expect(factoryTs).toContain('CORS_ORIGIN');
    expect(factoryTs).toContain('localhost:3001');
    expect(factoryTs).toContain('credentials: true');
  });

  it("confirms ServeStaticModule is removed from app.module", () => {
    const fs = require('fs');
    const moduleTs = fs.readFileSync('src/app.module.ts', 'utf8');

    expect(moduleTs).not.toContain('ServeStaticModule');
    expect(moduleTs).not.toContain('serve-static');
  });
});
