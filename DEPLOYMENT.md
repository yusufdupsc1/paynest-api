# Deployment Guide

## Recommended Live Stack

For the cleanest portfolio deployment, run PayNest as a single public service on Render, backed by Supabase PostgreSQL and Upstash Redis:

```text
Browser
  │
  ▼
Render Web Service
- serves `/` from [`public/index.html`](public/index.html)
- serves `/docs` from [`src/main.ts`](src/main.ts:23)
- serves live API routes from Nest controllers
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

- one host for UI and API
- same-origin requests from [`API_URL`](public/index.html:924)
- Render-compatible NestJS startup
- Supabase for durable relational data
- Upstash for Redis-backed reliability features

## What Must Work In Production

Your deployed app should make all of the following reachable from the same public origin:

- `/`
- `/docs`
- `/health`
- `/health/gateways`
- `/transactions`
- `/refunds`
- `/refunds/stats`
- `/analytics/summary`
- `/analytics/trends`
- `/webhooks`

The dashboard currently loads its initial data from [`Promise.all()`](public/index.html:2181) using these exact same-origin requests:

- `GET /transactions?limit=50`
- `GET /analytics/summary`
- `GET /analytics/trends?days=14`
- `GET /health/gateways`
- `GET /refunds?limit=8`
- `GET /refunds/stats`
- `GET /webhooks?limit=20`
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
2. Copy the Redis connection details.
3. Set these in Render:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_PASSWORD`

### Upstash Notes

- [`RedisModule`](src/config/redis.module.ts:10) expects host, port, and optional password values.
- If `REDIS_HOST` is missing, Redis-backed idempotency and retry support will not behave like the intended live demo.
- Upstash free tier is sufficient for the portfolio/demo workload.

## Step 3: Create the Render Web Service

### Render Manual Setup

1. Go to Render and create a new Web Service.
2. Connect this Git repository.
3. Choose the free tier plan.
4. Use these settings:

```text
Environment: Node
Build Command: npm install && npm run build-check
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
DB_SYNCHRONIZE=false
```

### Supabase PostgreSQL

```text
DB_HOST=<supabase-db-host>
DB_PORT=5432
DB_USERNAME=<supabase-db-user>
DB_PASSWORD=<supabase-db-password>
DB_DATABASE=<supabase-db-name>
```

### Upstash Redis

```text
REDIS_HOST=<upstash-redis-host>
REDIS_PORT=<upstash-redis-port>
REDIS_PASSWORD=<upstash-redis-password>
```

## Step 5: Add Gateway API Keys

### Important runtime note

[`StripeGateway`](src/gateways/stripe/stripe.gateway.ts:25) throws during app startup if `STRIPE_API_KEY` is missing. That means Stripe credentials are effectively required for the application to boot today.

Other gateway credentials are strongly recommended if you want the full multi-provider demo story, but many of those modules degrade until their routes are actually used.

### Stripe

```text
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

### PayPal

```text
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=
```

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

### Razorpay

```text
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_BASE_URL=https://api.razorpay.com/v1
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

## Step 8: Verify The Deployment

After the first successful deploy, verify all of the following:

1. `/` loads the landing page and demo login handoff.
2. `/docs` loads Swagger.
3. `/health` returns a JSON payload with gateway and webhook posture.
4. `/health/gateways` returns supported gateway metadata.
5. `/transactions?limit=5` returns transaction JSON.
6. `/refunds?limit=5` returns refund JSON.
7. `/refunds/stats` returns refund summary JSON.
8. `/analytics/summary` returns analytics summary JSON.
9. `/analytics/trends?days=14` returns trend data or an empty array.
10. `/webhooks?limit=20` returns inbox data and summary metadata.

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

### App boots locally but fails on Render

Check:

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
