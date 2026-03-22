# Deployment Guide

## Deployment Intent

This project is easiest to review when deployed as a single NestJS service that:

- serves the static dashboard shell from [`public/dashboard.html`](public/dashboard.html)
- exposes the API and Swagger docs from the same host
- connects to PostgreSQL and Redis for persistence and idempotency/retry behavior

The live demo story is therefore less "frontend app + separate backend" and more "one hosted operations surface backed by live API telemetry." That is the deployment posture this guide now documents.

## Architecture

```
┌───────────────────────────────┐
│ Hosted NestJS service         │
│ - /            → dashboard    │
│ - /docs        → Swagger      │
│ - /health      → readiness    │
│ - /webhooks/*  → inbox/replay │
│ - /analytics/* → metrics      │
│ - /refunds/*   → refund data  │
│ - /transactions/* → payments  │
└───────────────┬───────────────┘
                │
      ┌─────────┴─────────┐
      │                   │
┌───────────────┐  ┌───────────────┐
│ PostgreSQL    │  │ Redis         │
│ transactions  │  │ idempotency   │
│ webhooks      │  │ retry support │
│ refunds/audit │  │               │
└───────────────┘  └───────────────┘
```

## Live Demo Proof Narrative

A reviewer should be able to open the deployed root URL and verify:

1. the static dashboard shell loads from `/`
2. the dashboard populates from live API responses instead of mocked JSON
3. the Webhooks and Reliability views show backlog/replay/signature posture
4. the Gateways, Refunds, and Analytics views reflect the broader portfolio surface
5. Swagger is available at `/docs` for raw endpoint inspection

If the API is unavailable, the dashboard intentionally enters its connection-error state rather than masking missing telemetry.

## Step 1: Setup Supabase PostgreSQL

1. Go to https://supabase.com and create an account
2. Create a new project
3. Get your connection string from Settings → Database → Connection String
4. Note your database password

## Step 2: Deploy NestJS Backend

Railway, Render, Fly.io, or any comparable Node host will work. The key requirement is that the deployed service serves both the dashboard and API from one reachable origin, or that you deliberately configure the dashboard API base for split-host deployment.

### Railway example

1. Go to https://railway.app and connect your GitHub
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo: `yusufdupsc1/webhook-reliability-lab`
4. Railway will auto-detect NestJS

### Configure Environment Variables in Railway

```
NODE_ENV=production
PORT=3000
DB_HOST=<your-supabase-host>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<your-supabase-password>
DB_DATABASE=postgres
REDIS_HOST=<railway-redis or upstash-url>
REDIS_PORT=6379
```

Notes:

- CORS is currently permissive in [`configureApp()`](src/app.factory.ts:3), so `CORS_ORIGIN` is not presently enforced by code.
- PostgreSQL and Redis are both required for the product story this repository is trying to demonstrate.
- The application currently uses TypeORM `synchronize: true` in [`src/app.module.ts`](src/app.module.ts:42). That is convenient for demos, but reviewers should treat it as a non-production-safe shortcut rather than a hardened migration strategy.

### Start command

```bash
bun run build && bun run start:prod
```

The older migration command examples referenced a non-present data-source file and are not the current source of truth for this repository.

## Step 3: Decide how the dashboard reaches the API

### Option A: Single-origin deployment recommended for portfolio review

Host the NestJS service and static dashboard together. In that case, the root URL serves the dashboard and the same host also exposes the API.

### Option B: Split-host deployment

If you want the static dashboard on one host and the API on another, update [`API_URL`](public/dashboard.html:827) in [`public/dashboard.html`](public/dashboard.html) so it points at the public API origin.

Current source:

```javascript
const API_URL = window.location.origin.replace(/:\d+$/, ":3000");
```

Example override for split-host deployment:

```javascript
const API_URL = "https://your-api-host.example.com";
```

Important: the dashboard currently requests `/api/v1/transactions`, `/api/v1/analytics/*`, `/api/v1/health*`, and `/api/v1/refunds*`, but it requests `/webhooks` directly. Since the NestJS controllers in this repository are not globally prefixed, a production deployment must either:

- expose matching `/api/v1/...` routes through a reverse proxy/gateway, or
- adjust the dashboard fetch paths to the deployed controller paths

For portfolio clarity, do not ignore this mismatch; make one of those approaches explicit in the deployment you show reviewers.

## Quick Alternative: All-in-One Deploy (Render)

1. Go to https://render.com
2. Create Web Service from your GitHub repo
3. Build command: `bun install && bun run build`
4. Start command: `bun run start:prod`
5. Add the same database and Redis environment variables as Railway
6. If using [`render.yaml`](render.yaml), review it before deployment because it still contains older `npm`-based defaults and a `/health` health check path that may need to be reconciled with your final route exposure

## Data Setup

This repository includes baseline SQL in [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql). If you are creating infrastructure manually in Supabase, use that file as the canonical starting point instead of the older shortened schema examples that were previously documented here.

For a truthful portfolio demo, ensure the database contains at least some representative transaction, webhook, refund, and analytics records; otherwise the dashboard will render correctly but with sparse operational storytelling.

## Required Environment and Service Setup

### Minimum services

- PostgreSQL
- Redis
- Node-compatible host that can serve the built NestJS app

### Required environment variables

At minimum, configure:

```
NODE_ENV=production
PORT=3000
DB_HOST=...
DB_PORT=5432
DB_USERNAME=...
DB_PASSWORD=...
DB_DATABASE=...
REDIS_HOST=...
REDIS_PORT=6379
```

### Gateway secrets

Gateway credentials are not required just to render the dashboard shell, but they are required for truthful live payment/webhook behavior. See `.env.example` for the current expected gateway variables.

## Dashboard Endpoint Contract

The current dashboard startup path depends on all of the following succeeding:

- `GET /api/v1/transactions?limit=50`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends?days=14`
- `GET /api/v1/health/gateways`
- `GET /api/v1/refunds?limit=8`
- `GET /api/v1/refunds/stats`
- `GET /webhooks?limit=20`
- `GET /api/v1/health`

The dashboard then issues additional follow-up requests for interactive depth:

- filtered `GET /webhooks?...` queries using `gateway`, `status`, `signatureStatus`, and `replayable`
- `GET /webhooks/:id` for selected event detail

If one of the startup responses fails, the shell shows a connection error by design. This is preferable for portfolio honesty because it proves the demo is driven by live dependencies instead of mocked fallback content.

## Verification Checklist

After deployment, verify the following URLs and behaviors:

1. `/` serves the dashboard shell
2. `/docs` serves Swagger UI
3. `/health` or your routed health endpoint returns health JSON
4. `/webhooks?limit=20` returns inbox data and summary metadata
5. Dashboard navigation exposes Overview, Transactions, Webhooks, Reliability, Gateways, Refunds, and Analytics
6. The Webhooks view can filter results and hydrate selected-event detail
7. The Reliability view shows backlog, replay, and timestamp telemetry

## Payment Gateway Setup

Each gateway needs its API keys configured. See `.env.example` for all required variables:

- **Stripe**: https://dashboard.stripe.com/apikeys
- **PayPal**: https://developer.paypal.com/
- **bKash**: https://developer.bka.sh/
- **Nagad**: https://developer.nagad.com.bd/
- **Razorpay**: https://dashboard.razorpay.com/app/keys

Add gateway credentials to your chosen host's environment configuration.

## Honesty Notes For Reviewers

- The dashboard is genuinely API-backed, but the breadth of UI surface is ahead of exhaustive automated validation for every provider.
- Gateway modules exist for 15+ providers, but live proof in a hosted demo depends on which credentials and sample data you actually configure.
- If analytics trend rows are sparse, the Analytics view will show empty-state messaging rather than fabricated charts.
- If you do not reconcile the current `/api/v1/...` dashboard fetch paths with the controller routes your host exposes, the dashboard will correctly fail closed into its connection-error state.
- The included [`render.yaml`](render.yaml) still reflects an older deployment baseline and should be treated as a starting point to reconcile, not as a guaranteed source of truth for the current dashboard contract.
