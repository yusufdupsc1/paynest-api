# Payment Dashboard - Technical Specification

## Project Overview

- **Project Name**: PayNest - Payment Orchestration and Webhook Reliability Lab
- **Type**: NestJS backend API with a static hosted dashboard shell in [`public/dashboard.html`](public/dashboard.html)
- **Core Functionality**: Multi-gateway payment orchestration, durable webhook ingest, refund operations, audit-aware replay visibility, and portfolio-grade operational storytelling
- **Target Users**: Reviewers, hiring teams, and operators evaluating how payment orchestration and webhook reliability can be presented as a credible control plane
- **Current Product Surface**: Overview, Transactions, Webhooks, Reliability, Gateways, Refunds, and Analytics views backed by live API responses

## Architecture

### Tech Stack

- **Backend**: NestJS (Node.js) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Cache/Queue**: Redis for idempotency keys and job queues
- **Docker**: Multi-stage Dockerfile for production

### Supported Payment Gateways (15+)

1. Stripe
2. PayPal
3. bKash (Bangladesh)
4. Nagad (Bangladesh)
5. Razorpay (India)
6. SSLCommerz (Bangladesh)
7. Aamarpay (Bangladesh)
8. Paytm (India)
9. PhonePe (India)
10. UPI (India)
11. Mercado Pago (Latin America)
12. Flutterwave (Africa)
13. Paystack (Africa)
14. Square (US/Canada)
15. Adyen (Global)

### Support Posture

- Gateway modules exist for the providers listed above and are wired into the orchestration layer through [`src/gateways/`](src/gateways/).
- "Support" in this repository means the project contains implementation scaffolding and configuration hooks for those gateways, not that every provider has end-to-end production certification or live credential validation in this environment.
- The hosted dashboard uses supported-gateway metadata primarily for portfolio coverage and observed activity framing via [`src/modules/health/health.controller.ts`](src/modules/health/health.controller.ts:14).

## Dashboard Architecture

### Hosted Surface Model

The live UI is intentionally delivered as a static asset through [`ServeStaticModule.forRoot()`](src/app.module.ts:27) and rendered from [`public/dashboard.html`](public/dashboard.html). This keeps deployment simple while still demonstrating a broader operations product surface.

### Dashboard Views

- **Overview** - KPI cards, gateway mix, payment status distribution, and operator notes that translate raw telemetry into a portfolio walkthrough
- **Transactions** - Filterable transaction queue with gateway and status narrowing plus selection-driven detail context
- **Webhooks** - Durable inbox feed with status, signature, retry, replay, and drill-in detail visibility
- **Reliability** - Health telemetry, backlog aging, replay posture, recent 24-hour flow, and timestamps for live-proof credibility
- **Gateways** - Support matrix and coverage narrative showing footprint versus observed recent activity
- **Refunds** - Queue posture, recent refund records, gateway split, and refund workload summary
- **Analytics** - Net volume, refund drag, gateway ranking, and recent trend storytelling

### Live Demo Workflow

1. The NestJS server boots and serves the static dashboard shell from [`public/dashboard.html`](public/dashboard.html).
2. The browser resolves [`API_URL`](public/dashboard.html:827) from the current origin by swapping the visible port to `3000`.
3. The dashboard then issues a single startup fetch fan-out via [`Promise.all()`](public/dashboard.html:2081) for the required operational endpoints.
4. If any required response fails, the dashboard intentionally shows a connection-error state instead of presenting a misleading partial demo.
5. Reviewers can then move through the seven dashboard views as a product walkthrough grounded in actual backend state.

### Dashboard Route and Asset Notes

- Hosted shell: `/` via static serving from [`src/app.module.ts`](src/app.module.ts:27)
- API docs: `/docs` via Swagger from [`src/main.ts`](src/main.ts:23)
- API routes: controller routes are mounted directly from NestJS controllers such as [`@Controller('health')`](src/modules/health/health.controller.ts:7) and [`@Controller('webhooks')`](src/modules/webhooks/webhooks.controller.ts:26)
- Dashboard expectation: the current frontend copy and fetch logic references `/api/v1/...` for transactions, analytics, health, and refunds while still calling `/webhooks` directly. A live deployment therefore needs either matching route exposure upstream or a dashboard API base adjustment during deployment.

## Database Schema

### Tables

#### `transactions`

| Column          | Type          | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| id              | UUID          | Primary key                                    |
| external_id     | VARCHAR(255)  | Gateway-specific transaction ID                |
| gateway         | VARCHAR(50)   | Payment gateway name                           |
| amount          | DECIMAL(15,2) | Transaction amount                             |
| currency        | VARCHAR(3)    | ISO currency code                              |
| status          | ENUM          | pending, completed, failed, refunded, disputed |
| customer_email  | VARCHAR(255)  | Customer email                                 |
| customer_phone  | VARCHAR(50)   | Customer phone                                 |
| metadata        | JSONB         | Gateway-specific data                          |
| idempotency_key | VARCHAR(255)  | Unique key for deduplication                   |
| created_at      | TIMESTAMP     | Creation time                                  |
| updated_at      | TIMESTAMP     | Last update time                               |

#### `webhook_events`

| Column           | Type         | Description                                                                                             |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| id               | UUID         | Primary key                                                                                             |
| gateway          | VARCHAR(50)  | Source gateway                                                                                          |
| event_id         | VARCHAR(255) | Gateway's event ID                                                                                      |
| event_type       | VARCHAR(100) | Event type                                                                                              |
| payload          | JSONB        | Raw webhook payload                                                                                     |
| status           | ENUM/TEXT    | Explicit processing state such as received, processing, processed, failed, invalid_signature, duplicate |
| signature_status | ENUM/TEXT    | Signature validity posture for replay and trust decisions                                               |
| processed        | BOOLEAN      | Legacy processed flag retained alongside richer status modeling                                         |
| processed_at     | TIMESTAMP    | When processed                                                                                          |
| retry_count      | INTEGER      | Number of retries                                                                                       |
| error_message    | TEXT         | Error if failed                                                                                         |
| raw_body         | TEXT         | Captured payload body for verification/debugging                                                        |
| headers          | JSONB        | Persisted request headers                                                                               |
| replayed_at      | TIMESTAMP    | When an admin replay executed                                                                           |
| last_retried_at  | TIMESTAMP    | Most recent retry execution time                                                                        |

#### `refunds`

| Column             | Type          | Description                |
| ------------------ | ------------- | -------------------------- |
| id                 | UUID          | Primary key                |
| transaction_id     | UUID          | FK to transactions         |
| external_refund_id | VARCHAR(255)  | Gateway's refund ID        |
| amount             | DECIMAL(15,2) | Refund amount              |
| status             | ENUM          | pending, completed, failed |
| reason             | TEXT          | Refund reason              |
| metadata           | JSONB         | Additional data            |
| created_at         | TIMESTAMP     | Creation time              |

#### `analytics_daily`

| Column             | Type          | Description       |
| ------------------ | ------------- | ----------------- |
| id                 | UUID          | Primary key       |
| date               | DATE          | Aggregation date  |
| gateway            | VARCHAR(50)   | Gateway name      |
| total_transactions | INTEGER       | Count             |
| total_amount       | DECIMAL(15,2) | Sum               |
| total_refunds      | DECIMAL(15,2) | Refund sum        |
| net_amount         | DECIMAL(15,2) | net after refunds |

## API Endpoints

### Transactions

- `POST /transactions/initiate` - Create payment
- `GET /transactions` - List transactions (paginated)
- `GET /transactions/:id` - Get transaction details
- `GET /transactions/stats/summary` - Transaction summary statistics

### Refunds

- `POST /refunds` - Create a refund through the refunds module
- `GET /refunds` - List refund records
- `GET /refunds/stats` - Refund queue and amount statistics
- `GET /refunds/:id` - Fetch a single refund record

### Webhooks

- `POST /webhooks/stripe` - Stripe webhook
- `POST /webhooks/paypal` - PayPal webhook
- `POST /webhooks/bkash` - bKash webhook
- `POST /webhooks/nagad` - Nagad webhook
- `POST /webhooks/razorpay` - Razorpay webhook
- `POST /webhooks/:gateway` - Generic webhook for other gateways
- `GET /webhooks` - Filterable webhook inbox feed with summary aggregates
- `GET /webhooks/:id` - Stored webhook event detail for drill-in UI
- `POST /webhooks/retry/:id` - Retry a failed webhook event
- `POST /webhooks/admin/:id/replay` - Replay a stored webhook event when posture allows

### Analytics

- `GET /analytics/summary` - Dashboard summary
- `GET /analytics/by-gateway` - Per-gateway breakdown
- `GET /analytics/trends` - Time-series data
- `GET /analytics/refunds` - Refund analytics

### Health & Admin

- `GET /health` - Health check with webhook backlog visibility and reliability summary
- `GET /health/gateways` - List supported gateways

### Dashboard Dependency Contract

The current hosted dashboard depends on the following HTTP responses during initial load:

- `GET /api/v1/transactions?limit=50`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends?days=14`
- `GET /api/v1/health`
- `GET /api/v1/health/gateways`
- `GET /api/v1/refunds?limit=8`
- `GET /api/v1/refunds/stats`
- `GET /webhooks?limit=20`

It also performs follow-up webhook queries for richer operator behavior:

- `GET /webhooks?limit=20&gateway=...&status=...&signatureStatus=...&replayable=...`
- `GET /webhooks/:id`

These fetches are encoded directly in [`public/dashboard.html`](public/dashboard.html:2031) and [`public/dashboard.html`](public/dashboard.html:2081). Reviewers should treat them as the source of truth for the current live demo contract.

## Core Features

### 1. Unified Payment Initiation

```typescript
interface PaymentRequest {
  gateway: GatewayType;
  amount: number;
  currency: string;
  customer: {
    email: string;
    phone: string;
    name?: string;
  };
  idempotencyKey: string;
  metadata?: Record<string, any>;
  returnUrl?: string;
}
```

### 2. Webhook Signature Verification

Each gateway has custom signature verification:

- Stripe: HMAC-SHA256 with `stripe-signature` header
- PayPal: Verify webhook signature via PayPal API
- bKash: Token validation with merchant credentials
- Razorpay: HMAC-SHA256 with `x-razorpay-signature` header
- Others: Per gateway specification

### 3. Idempotency Implementation

- Redis-based idempotency key storage
- 24-hour key expiration
- Transaction mapping for duplicate detection
- Automatic conflict resolution

### 4. Retry Logic

- Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 retries)
- Dead letter queue after max retries
- Manual retry capability via admin API
- Webhook event replay support

### 5. Transaction States

```
pending → completed (success)
pending → failed (declined/error)
completed → refunded (full refund)
completed → partially_refunded (partial refund)
completed → disputed (chargeback)
```

## Project Structure

```
/workspace/payment-dashboard/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── redis.module.ts
│   │   └── gateway.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── utils/
│   ├── modules/
│   │   ├── transactions/
│   │   ├── webhooks/
│   │   ├── refunds/
│   │   ├── analytics/
│   │   ├── audit/
│   │   └── health/
│   └── gateways/
│       ├── stripe/
│       ├── paypal/
│       ├── bkash/
│       ├── nagad/
│       ├── razorpay/
│       └── ... (others)
├── test/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── supabase/
│   └── migrations/
├── public/
│   └── dashboard.html
├── package.json
├── tsconfig.json
└── README.md
```

## Security Requirements

- All webhook endpoints verify signatures before processing
- Idempotency keys prevent duplicate transactions
- Rate limiting on all endpoints
- Input validation on all requests
- Environment variables for all secrets
- CORS configuration for dashboard access

## Docker Configuration

- Multi-stage build (builder → production)
- Non-root user in container
- Health check endpoint
- Environment-based configuration
- Volume for persistent data

## Validation Foundation

- Split Jest projects for `unit`, `integration`, `e2e`, and `regression` suites via [`jest.config.ts`](jest.config.ts)
- Non-mutating quality gates via [`package.json`](package.json): `lint-check`, `type-check`, and `build-check`
- Shared test fixtures/helpers under [`test/`](test/) for canonical webhook payloads, request payloads, mock repositories, and bootstrap reuse
- Regression coverage includes dashboard-shell contract checks in [`test/regression/dashboard-shell.spec.ts`](test/regression/dashboard-shell.spec.ts)
- Current validation is strongest around webhook hardening, replay guardrails, health telemetry contracts, and refund lifecycle paths rather than end-to-end gateway certification across all providers

## Portfolio Story Goals

- Show that webhook durability is implemented in the backend and made legible in the UI
- Demonstrate replay and retry posture without a frontend framework rewrite
- Keep static hosting compatibility for NestJS while making the product demo feel like a serious operations surface
- Be honest about the difference between implemented gateway modules, demoable dashboard breadth, and the subset of behaviors covered by automated validation today
