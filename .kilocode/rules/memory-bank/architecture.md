# System Patterns: PayNest NestJS + Static Dashboard

## Architecture Overview

```
src/
├── main.ts                    # Nest bootstrap + Swagger
├── app.factory.ts             # Shared app configuration (CORS, validation)
├── app.module.ts              # Root module + static asset serving
├── config/                    # Config and Redis wiring
├── gateways/                  # Payment gateway implementations
├── common/                    # Shared enums, DTO-like types, utilities
└── modules/
    ├── transactions/          # Payment initiation, listing, stats
    ├── refunds/               # Refund creation, listing, stats
    ├── webhooks/              # Webhook inbox, replay, retry, summaries
    ├── analytics/             # Dashboard analytics endpoints
    ├── health/                # Service health + reliability telemetry
    └── audit/                 # Audit trail persistence

public/
└── dashboard.html             # Landing page, demo login, and hosted dashboard shell
```

## Key Design Patterns

### 1. Single-Service Hosted Surface

- NestJS serves both API routes and the static UI from one host.
- [src/app.module.ts](src/app.module.ts:27) mounts [public](public) via `ServeStaticModule`.
- Root `/` is the landing page + demo login + dashboard entry experience in [public/dashboard.html](public/dashboard.html).

### 2. Same-Origin API Contract

- Frontend fetches in [public/dashboard.html](public/dashboard.html) should target the actual mounted NestJS routes.
- Avoid introducing docs/UI references to `/api/v1/...` unless the backend explicitly adds that prefix.
- Render deployment should work without requiring a second frontend host.

### 3. Reliability-First Backend Modeling

- Webhooks are treated as durable inbox records, not fire-and-forget handlers.
- Health endpoints expose backlog and reliability posture.
- Audit logging records meaningful status transitions and replay attempts.

### 4. Demo Product Flow

- First impression: professional landing page.
- Entry control: static demo-login handoff.
- Product depth: operational dashboard with Transactions, Webhooks, Reliability, Gateways, Refunds, and Analytics views.

## UI / Styling Conventions

- Tailwind via CDN in [public/dashboard.html](public/dashboard.html) is acceptable for the current hosted shell.
- Favor premium SaaS visual language: dark hero surfaces, clear KPI cards, polished spacing, trust-oriented copy.
- Preserve graceful loading and explicit connection-error states.

## Backend Conventions

- Controllers stay route-focused and thin.
- Services own orchestration, persistence behavior, and reliability logic.
- TypeORM entities should use accurate nullability to keep build-time typing stable.
- Shared app concerns belong in [src/app.factory.ts](src/app.factory.ts:3).

## File Naming Conventions

- Nest modules and services follow standard lowercase directory naming.
- Entity files end with `.entity.ts`.
- Tests are grouped by `unit`, `integration`, `e2e`, and `regression` under [test](test).

## State Management

- Client state is lightweight and lives directly in the in-page script in [public/dashboard.html](public/dashboard.html:829).
- Backend is the source of truth for dashboard data.
- Prefer enriching API summaries over adding brittle client-side data fabrication.
