# Active Context: Payment Dashboard (PayNest)

## Current State

**Project Status**: ✅ In Progress - Backend reliability foundation hardened, frontend upgraded from an overview shell into a broader multi-view operational dashboard, the documentation/deployment surface now better explains the live demo contract, routing expectations, and honest support posture, and the local validation contract is less Bun-coupled so normal installed tooling can execute quality gates more predictably

A NestJS payment orchestration backend with 15+ gateway integrations, now paired with a significantly stronger static dashboard surface that frames the product as a payment orchestration and webhook reliability platform. The current hosted experience now emphasizes overview KPIs, trust/reliability cues, gateway portfolio coverage, refund operations posture, and analytics storytelling while remaining compatible with the existing static-serving approach.

## Recently Completed

- [x] NestJS backend with TypeScript
- [x] 15 Payment gateways (Stripe, PayPal, bKash, Nagad, Razorpay, SSLCommerz, Aamarpay, Paytm, PhonePe, UPI, Mercado Pago, Flutterwave, Paystack, Square, Adyen)
- [x] Unified transaction dashboard with pagination and filtering
- [x] Webhook receiver with signature verification per gateway
- [x] Redis-based idempotency with 24-hour key expiration
- [x] Retry logic with exponential backoff (max 5 retries)
- [x] Transaction history & analytics
- [x] Refund management with full/partial refund support
- [x] PostgreSQL database with TypeORM
- [x] Docker configuration (multi-stage build, docker-compose)
- [x] Swagger API documentation at `/docs`
- [x] Durable webhook inbox fields added for status, signature state, raw body, headers, normalized keys, retry scheduling, and processing timestamps
- [x] Webhook ingest/refetch flow refactored to explicit processing states with retry-safe persistence boundaries
- [x] Health endpoint now exposes webhook backlog visibility for readiness monitoring
- [x] Added `audit_logs` baseline for transaction, refund, and webhook replay history
- [x] Transaction creation/status changes and refund creation/status changes now write structured audit entries
- [x] Added minimal admin webhook replay endpoint/service flow with persisted replay metadata and audit capture
- [x] Reworked the static dashboard into a multi-section application shell with branded overview storytelling and clearer layout hierarchy
- [x] Added overview KPI cards, reliability posture messaging, gateway summaries, recent activity, and future-view navigation scaffolding in the frontend shell
- [x] Added a structured Jest validation foundation with separate unit, integration, e2e, and regression projects
- [x] Added non-mutating quality-gate scripts for lint, type-check, and build verification
- [x] Added first automated tests around webhook invalid-signature handling, duplicate suppression, replay guardrails, backlog-aware health responses, security-smoke header enforcement, and refund lifecycle orchestration
- [x] Expanded the hosted dashboard into a stronger multi-view control surface with Transactions, Webhooks, and Reliability views driven by existing API state
- [x] Surfaced webhook processing statuses, signature posture, retry/replay visibility, backlog cues, health telemetry, and audit-oriented reliability narrative directly in the UI
- [x] Added lightweight regression coverage for the hosted dashboard shell structure and required API wiring
- [x] Added filterable webhook inbox feed APIs with aggregate summary metadata for dashboard-ready operational views
- [x] Added a detail endpoint for stored webhook events so the inbox can evolve toward drill-in UX without reworking webhook architecture
- [x] Enriched health telemetry with a reliability summary covering replay visibility, blocked replay posture, retry exhaustion, recent 24-hour activity, and latest webhook timestamps
- [x] Extended e2e, regression, and unit validation around webhook feed contracts and richer health reliability payloads
- [x] Wired the hosted dashboard webhook view to server-side feed filters, API-backed summary cards, and detail hydration from stored webhook event records
- [x] Expanded the hosted reliability view to consume richer health reliability telemetry including replay blockers, retry exhaustion, 24-hour flow, and recent timestamps
- [x] Updated dashboard regression coverage and deployment notes for the deeper webhook feed/detail and reliability wiring
- [x] Expanded the hosted dashboard Gateways view into a portfolio-ready provider coverage matrix with live activity, capability framing, and footprint posture
- [x] Expanded the hosted dashboard Refunds view with queue posture, recent refund records, lifecycle notes, and gateway mix using existing refund endpoints
- [x] Expanded the hosted dashboard Analytics view with net volume, refund drag, gateway ranking, and trend storytelling backed by summary and trends endpoints
- [x] Updated dashboard regression coverage and deployment notes for the new gateway/refund/analytics wiring and endpoint expectations
- [x] Refined `SPEC.md` with the seven-view dashboard architecture, startup fetch contract, route expectations, and more explicit support-posture guidance
- [x] Reworked `DEPLOYMENT.md` around a single-service live demo story, required API dependencies, `/api/v1` routing caveat, and honest reviewer verification steps
- [x] Tightened dashboard-facing connection copy and regression coverage to better communicate required live endpoints during portfolio walkthroughs
- [x] Normalized validation scripts so `build`, `build-check`, and `type-check` invoke installed Nest/TypeScript CLIs directly instead of Bun wrappers
- [x] Expanded flat ESLint coverage to include `test/**/*.ts` and `jest.config.ts` so local linting matches the intended validation surface
- [x] Fixed Stripe webhook transaction reconciliation to use the verified payload shape returned by the Stripe gateway
- [x] Replaced wildcard credentialed CORS with an explicit/configurable origin allowlist in the shared app factory

## Architecture

```
src/
├── main.ts                    # Bootstrap
├── app.module.ts              # Root module
├── config/                    # Configuration
│   ├── config.module.ts
│   ├── redis.module.ts
│   └── gateway.config.ts
├── common/
│   ├── types.ts              # Enums and interfaces
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── utils/
├── gateways/                  # 15 Payment gateways
│   ├── stripe/
│   ├── paypal/
│   ├── bkash/
│   ├── nagad/
│   ├── razorpay/
│   └── ... (11 more)
├── modules/
│   ├── transactions/         # Payment initiation & listing + audit-aware status changes
│   ├── webhooks/             # Webhook inbox persistence + processing lifecycle + replay scaffolding
│   ├── refunds/              # Refund operations + audit-aware status changes
│   ├── audit/                # Shared audit log persistence/service
│   ├── analytics/            # Dashboard analytics
│   └── health/               # Health and backlog visibility
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── test/                      # Validation foundation with shared fixtures/helpers and split suites
└── supabase/migrations/      # Database schema
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/transactions/initiate` | Create payment |
| GET | `/api/v1/transactions` | List transactions |
| GET | `/api/v1/transactions/:id` | Get transaction |
| POST | `/api/v1/transactions/:id/refund` | Create refund |
| POST | `/webhooks/stripe` | Stripe webhook |
| POST | `/webhooks/paypal` | PayPal webhook |
| POST | `/webhooks/:gateway` | Generic webhook |
| POST | `/webhooks/admin/:id/replay` | Replay a stored webhook event |
| GET | `/webhooks` | Filterable webhook inbox feed with aggregate summary |
| GET | `/webhooks/:id` | Webhook event detail for drill-in views |
| GET | `/api/v1/analytics/summary` | Dashboard summary |
| GET | `/api/v1/analytics/trends` | Time-series data |
| GET | `/api/v1/health` | Health check with webhook backlog and reliability summary |

## Database Tables

- `transactions` - Payment transactions
- `webhook_events` - Durable webhook inbox with explicit status, signature, retry, and processing metadata
- `refunds` - Refund records
- `audit_logs` - Audit trail for transaction/refund lifecycle events and webhook replay attempts
- `analytics_daily` - Daily aggregated stats

## Environment Variables

See `.env.example` for all required configuration.

## Running

```bash
# Development
bun install
bun run start:dev

# Production with Docker
docker-compose -f docker/docker-compose.yml up -d

# Type check
bun run typecheck

# Lint
bun run lint

# Non-mutating quality gates
bun run lint-check
bun run type-check
bun run build-check

# Focused validation
bun run test:unit
bun run test:integration
bun run test:e2e
bun run test:regression
```

## Session History

| Date | Changes |
|------|---------|
| 2026-03-21 | Created payment dashboard with 15 gateway integrations |
| 2026-03-21 | Added explicit webhook inbox statuses, richer persistence metadata, retry scheduling, and health backlog visibility |
| 2026-03-21 | Added `audit_logs`, transaction/refund audit capture, and minimal admin webhook replay scaffolding |
| 2026-03-21 | Replaced the basic static dashboard with a portfolio-style overview shell and future navigation scaffolding |
| 2026-03-21 | Added the first testing and quality-gate foundation slice with split Jest projects, shared fixtures/helpers, webhook/refund coverage, and smoke validation scaffolding |
| 2026-03-21 | Expanded the hosted dashboard from an overview shell into Transactions, Webhooks, and Reliability views with API-backed operational depth and portfolio-oriented reliability storytelling |
| 2026-03-21 | Added filterable webhook feed APIs, detail-ready webhook retrieval, and richer health reliability telemetry to better support the hosted dashboard's operational views |
| 2026-03-21 | Wired the hosted dashboard to richer webhook feed/detail filters and reliability telemetry, then updated regression/docs to match the deeper operational demo surface |
| 2026-03-21 | Deepened the hosted dashboard with portfolio-grade Gateways, Refunds, and Analytics views using existing health, refund, and analytics APIs |
| 2026-03-21 | Clarified portfolio-readiness docs with a stronger dashboard architecture narrative, deployment contract, routing caveats, and demo-facing copy polish |
| 2026-03-21 | Reduced Bun-specific validation coupling by pointing quality-gate scripts at installed Nest/TypeScript CLIs and widening ESLint flat-config coverage to tests and Jest config |
| 2026-03-21 | Patched follow-up regressions by restoring Stripe webhook transaction reconciliation and replacing wildcard credentialed CORS with a configurable allowlist |
