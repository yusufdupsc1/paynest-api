# PayNest

PayNest is a NestJS-based payment orchestration and webhook reliability lab that presents a production-style control plane for transactions, refunds, gateway coverage, replayable webhooks, and operator-facing telemetry.

## What this repository demonstrates

- Multi-gateway payment orchestration through [`src/gateways/`](src/gateways/)
- Durable webhook ingest, replay, and reliability summaries through [`src/modules/webhooks/`](src/modules/webhooks/)
- Refund lifecycle handling through [`src/modules/refunds/`](src/modules/refunds/)
- Dashboard-facing analytics and operational health endpoints through [`src/modules/analytics/`](src/modules/analytics/) and [`src/modules/health/`](src/modules/health/)
- A hosted control-surface UI served from [`public/index.html`](public/index.html)

## Primary workflows

### Native local development

1. Start PostgreSQL and Redis locally.
2. Create a local [`.env`](.env) with your app, database, Redis, and gateway settings.
3. Start the app:

```bash
bun run start:dev
```

4. Open:

- [`/`](src/app.module.ts:29) for the hosted dashboard
- [`/docs`](src/main.ts:23) for Swagger
- [`/health`](src/modules/health/health.controller.ts:14) for runtime verification

### Docker workflow

Build and run the stack with:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

The Docker builder is Bun-native and aligned with [`bun.lock`](bun.lock) via [`docker/Dockerfile`](docker/Dockerfile).

## Verification standard

Run the release gate before treating a branch as deployable:

```bash
bun run test:release-gate
```

See [`PRODUCTION_VERIFICATION.md`](PRODUCTION_VERIFICATION.md) for the complete checklist.

## Deployment references

- Render blueprint: [`render.yaml`](render.yaml)
- Deployment runbook: [`DEPLOYMENT.md`](DEPLOYMENT.md)
- Technical specification: [`SPEC.md`](SPEC.md)

## Repository hygiene notes

- Local environment files, Redis dumps, screenshots, and ad hoc logs are intentionally excluded by [`.gitignore`](.gitignore).
- The production image copies both compiled output and hosted static assets so the containerized app can serve [`/`](src/app.module.ts:29) correctly.
