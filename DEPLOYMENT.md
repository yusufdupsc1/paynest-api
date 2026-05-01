# Deployment Guide

## Recommended Live Stack

For the cleanest portfolio deployment, run PayNest as an API-only service on Render, backed by Supabase PostgreSQL and Upstash Redis, with the Next.js frontend deployed separately on Vercel:

```text
Browser
  │
  ▼
Render Web Service
- serves `/docs` from [`src/main.ts`](src/main.ts:23)
- serves live API routes from Nest controllers under `/api/v1/*`
- exposes `/health` outside the API prefix
  │                    │
  │                    └── Upstash Redis
  │                        - idempotency keys
  │                        - retry support
  │
  └── Supabase PostgreSQL
      - transactions
      - refunds
      - webhook inbox
      - audit logs
      - analytics
```

This is the deployment posture the current codebase is optimized for:

- Render hosts the API only
- Vercel hosts the frontend and calls Render through `NEXT_PUBLIC_API_URL`
- Render-compatible NestJS startup
- Supabase for durable relational data
- Upstash for Redis-backed reliability features

## What Must Work In Production

Your deployed API should make all of the following reachable from the Render origin:

- `/docs`
- `/health`
- `/health/gateways`
- `/api/v1/transactions`
- `/api/v1/refunds`
- `/api/v1/refunds/stats`
- `/api/v1/analytics/summary`
- `/api/v1/analytics/trends`
- `/api/v1/webhooks`

The Vercel frontend should call the Render API origin with these `/api/v1` routes:

- `GET /api/v1/transactions?limit=50`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends?days=14`
- `GET /health/gateways`
- `GET /api/v1/refunds?limit=8`
- `GET /api/v1/refunds/stats`
- `GET /api/v1/webhooks?limit=20`
- `GET /health`

If any of those fail, the UI intentionally falls into a connection-error state instead of masking deployment problems.

## Step 1: Provision Supabase PostgreSQL

1. Create a Supabase project.
2. Open the database connection details in Supabase.
3. Collect these values for Render:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_DATABASE`
4. Open the SQL editor and run the baseline schema from [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).

### Supabase Notes

- Use the direct Postgres host/port credentials for the Nest app.
- Keep `DB_SYNCHRONIZE=false` on Render once the schema is applied.
- If you reset the Supabase database, rerun [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).

## Step 2: Provision Upstash Redis

1. Create an Upstash Redis database.
2. Copy either the Redis connection URL or the split host/port/password values.
3. Set either `REDIS_URL=rediss://...` or the split values `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, and `REDIS_TLS=true` in Render.

### Upstash Notes

- [`RedisModule`](src/config/redis.module.ts:10) supports either `REDIS_URL` or the split host/port/password variables, and can enable TLS with `REDIS_TLS=true`.
- `npm run preflight:env` accepts either `REDIS_URL` or the split Redis variables. In production, `REDIS_URL` must use `rediss://`.
- If both `REDIS_URL` and `REDIS_HOST` are missing, Redis-backed idempotency and retry support will not behave like the intended live demo.
- Upstash free tier is sufficient for the portfolio/demo workload.

## Step 3: Create the Render Web Service

### Render Manual Setup

1. Go to Render and create a new Web Service.
2. Connect this Git repository.
3. Choose the free tier plan.
4. Use these settings:

```text
Environment: Node
Build Command: npm ci && npm run preflight:env && npm run build-check
Start Command: npm run start:prod
Health Check Path: /health
```

### Why npm-based commands are recommended on Render

The repository is Bun-first in CI and Docker, but the project scripts in [`package.json`](package.json:6) remain npm-compatible. For Render free-tier simplicity, use the Node host with npm-based install/build/start commands unless you deliberately switch the platform to a Bun-native build image.

## Step 4: Configure Required Render Environment Variables

Set the following variables in Render before the first successful boot.

### Core application

```text
NODE_ENV=production
PORT=3000
APP_URL=https://your-render-service.onrender.com
APP_ORIGIN=https://your-render-service.onrender.com
CORS_ORIGIN=https://your-frontend-origin.example
DB_SYNCHRONIZE=false
```

### Authentication

Production auth configuration is strict. The app fails during startup when any of these values are missing, weak, or still set to demo/placeholder defaults.

```text
JWT_SECRET=<unique-random-secret-at-least-32-characters>
JWT_EXPIRES_IN=24h
ADMIN_PASSWORD=<unique-admin-password>
OPERATOR_PASSWORD=<unique-operator-password>
VIEWER_PASSWORD=<unique-viewer-password>
```

Auth requirements:

- `JWT_SECRET` must be unique, random, at least 32 characters, and must not equal demo values such as `paynest-dev-secret-change-in-production`, `test-secret`, or `change-me-to-a-random-64-char-string`.
- `ADMIN_PASSWORD`, `OPERATOR_PASSWORD`, and `VIEWER_PASSWORD` must all be set to non-default values.
- Do not use local/demo passwords such as `admin123`, `operator123`, `viewer123`, `password`, `changeme`, or `change-me-*` placeholders in production.
- Local development still falls back to demo credentials when these values are absent, but startup logs warnings so the fallback is visible.

### Environment preflight

Run the preflight before deployment to catch missing or malformed environment variables before runtime startup checks:

```bash
npm run preflight:env
```

For CI or deploy-readiness checks, run:

```bash
npm run test:deploy-readiness
```

The preflight loads `.env` when present, respects variables already supplied by the shell or Render, and reports only variable names with actionable fixes.

### Supabase PostgreSQL

```text
DB_HOST=<supabase-db-host>
DB_PORT=5432
DB_USERNAME=<supabase-db-user>
DB_PASSWORD=<supabase-db-password>
DB_DATABASE=<supabase-db-name>
```

### Upstash Redis

Use either a single TLS Redis URL:

```text
REDIS_URL=rediss://default:<upstash-redis-password>@<upstash-redis-host>:<upstash-redis-port>
```

Or use the split variables from `render.yaml`:

```text
REDIS_HOST=<upstash-redis-host>
REDIS_PORT=<upstash-redis-port>
REDIS_PASSWORD=<upstash-redis-password>
REDIS_TLS=true
```

## Step 5: Add Gateway API Keys From render.yaml

### Important runtime note

[`StripeGateway`](src/gateways/stripe/stripe.gateway.ts:25) throws during app startup if `STRIPE_API_KEY` is missing. That means Stripe credentials are effectively required for the application to boot today.

Other gateway credentials are strongly recommended if you want the full multi-provider demo story, but many of those modules degrade until their routes are actually used.

### Stripe

```text
STRIPE_API_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

### PayPal

```text
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_CLIENT_SECRET=<paypal-client-secret>
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=<paypal-webhook-id>
```

### Razorpay

```text
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>
```

These are the gateway keys present in [`render.yaml`](render.yaml). Additional provider credentials below are optional and should be added only when you are actively validating that provider.

Configure provider webhook URLs against the Render API origin:

```text
Stripe:   https://your-render-service.onrender.com/api/v1/webhooks/stripe
PayPal:   https://your-render-service.onrender.com/api/v1/webhooks/paypal
Razorpay: https://your-render-service.onrender.com/api/v1/webhooks/razorpay
```

The generic `/api/v1/webhooks/:gateway` route remains present for compatibility but intentionally fails closed. Use only the explicit provider webhook URLs above for production-like validation.

### Optional additional provider credentials

### bKash

```text
BKASH_API_KEY=
BKASH_API_SECRET=
BKASH_MERCHANT_ID=
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_BASE_URL=https://checkout.sandbox.bka.sh/v1.2.0-beta
```

### Nagad

```text
NAGAD_MERCHANT_ID=
NAGAD_MERCHANT_KEY=
NAGAD_USERNAME=
NAGAD_PASSWORD=
NAGAD_BASE_URL=https://sandbox.mynagad.com
```

### SSLCommerz

```text
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_BASE_URL=https://sandbox.sslcommerz.com
```

### Aamarpay

```text
AAMARPAY_STORE_ID=
AAMARPAY_SIGNATURE_KEY=
AAMARPAY_BASE_URL=https://sandbox.aamarpay.com
```

### Paystack

```text
PAYSTACK_SECRET_KEY=
```

### Flutterwave

```text
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
```

### Mercado Pago

```text
MERCADOPAGO_ACCESS_TOKEN=
```

### Square

```text
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
```

### Adyen

```text
ADYEN_API_KEY=
ADYEN_MERCHANT_ACCOUNT=
```

### PhonePe

```text
PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

### Providers currently scaffolded without active secret requirements in the current code

- Paytm support exists in [`PaytmGateway`](src/gateways/paytm/paytm.gateway.ts:7), but the current implementation is placeholder-oriented.
- UPI support exists in [`UpiGateway`](src/gateways/upi/upi.gateway.ts:7), but the current implementation is placeholder-oriented.

## Step 6: Set Correct Public URL Behavior

Several gateways now derive callback and return URLs from [`buildPublicAppUrl()`](src/gateways/utils/public-app-url.util.ts:27). That makes `APP_URL` critical.

Use your real Render public URL:

```text
APP_URL=https://your-render-service.onrender.com
APP_ORIGIN=https://your-render-service.onrender.com
```

Why both matter:

- `APP_URL` is used for public callback and return URL construction.
- `APP_ORIGIN` is used by [`configureApp()`](src/app.factory.ts:12) for CORS allowlisting.

If `APP_URL` is malformed, the app now fails fast instead of silently producing localhost callbacks.

## Step 7: Optional Render Blueprint Setup

[`render.yaml`](render.yaml) now reflects the same Render + Supabase + Upstash deployment posture documented here. You can use it as a baseline, but you still need to provide your real secret values in Render.

## Manual Deploy Checklist

1. Create a Render Web Service using Node.
2. Set every env var listed in [`render.yaml`](render.yaml) and [`RENDER_STEP1_ENV_SHEET.md`](RENDER_STEP1_ENV_SHEET.md) with real values.
3. Apply Supabase migrations from [`supabase/migrations`](supabase/migrations), including the webhook schema alignment migration if the database was created from an older baseline.
4. Deploy with `npm ci && npm run preflight:env && npm run build-check` and `npm run start:prod`.
5. Verify `https://your-render-service.onrender.com/health` returns `status: ok`.
6. Verify `https://your-render-service.onrender.com/docs` loads Swagger.
7. Verify the frontend environment has `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com` and is not pointing to localhost.

## Step 8: Verify The Deployment

After the first successful deploy, verify all of the following:

1. `/docs` loads Swagger.
2. `/health` returns a JSON payload with gateway and webhook posture.
3. `/health/gateways` returns supported gateway metadata.
4. `/api/v1/transactions?limit=5` returns transaction JSON.
5. `/api/v1/refunds?limit=5` returns refund JSON.
6. `/api/v1/refunds/stats` returns refund summary JSON.
7. `/api/v1/analytics/summary` returns analytics summary JSON.
8. `/api/v1/analytics/trends?days=14` returns trend data or an empty array.
9. `/api/v1/webhooks?limit=20` returns inbox data and summary metadata for admin/operator users.

Webhook inbox and detail endpoints are restricted to admin/operator roles because stored webhook records can contain provider operational data.

## Recommended Demo Seed Strategy

For a believable public demo, prepare at least:

- a few completed and pending transactions
- at least one refund record
- several webhook events across different statuses
- some daily analytics rows for trend charts

Without seeded records, the app will still deploy correctly, but the dashboard will feel sparse.

## Render Free-Tier Caveats

- Cold starts can delay the first request.
- Free-tier networking can make webhook round-trips less predictable than paid infrastructure.
- If your service sleeps, reconnecting to the dashboard may briefly show loading delays.
- Use sandbox credentials for external payment providers whenever possible.

## Troubleshooting

### Top 5 deployment failure modes

1. CORS blocked: set `CORS_ORIGIN` to the deployed frontend origin, redeploy the API, then retry from the browser.
2. Missing Stripe key on boot: set `STRIPE_API_KEY` in Render; the app intentionally fails startup without it.
3. Bad DB credentials: verify `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` against Supabase connection details.
4. Redis unavailable: verify either `REDIS_URL=rediss://...` or `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, and `REDIS_TLS=true` for Upstash.
5. Frontend still points to localhost: set frontend `NEXT_PUBLIC_API_URL` to the Render API origin and redeploy the frontend.

### App boots locally but fails on Render

Check:

- `npm run preflight:env` passes with the same environment values configured in Render
- `JWT_SECRET` is present, at least 32 characters, and not a demo/placeholder value
- `ADMIN_PASSWORD`, `OPERATOR_PASSWORD`, and `VIEWER_PASSWORD` are present and non-default
- `STRIPE_API_KEY` is present
- `APP_URL` is a valid absolute `https://...` URL
- Supabase credentials are correct
- Upstash credentials are correct
- `DB_SYNCHRONIZE=false`

### Dashboard shows connection error

Check the startup endpoints listed earlier in this guide. The dashboard is same-origin and expects the live Nest routes mounted by the app.

### Webhooks do not appear

Check:

- provider webhook URLs target your Render host
- callback URLs are using the real `APP_URL`
- relevant gateway secrets are configured
- Redis is connected so retry/idempotency behavior is available

## Reviewer-Facing Honesty Notes

- The dashboard is real and API-backed.
- The operational surface is broader than the current live-credential coverage most demos will actually configure.
- Gateway breadth in the UI represents implementation coverage plus configured credentials, not a promise that every provider is production-certified in this environment.
- Render free tier is good for a portfolio walkthrough, not for production-grade reliability guarantees.
