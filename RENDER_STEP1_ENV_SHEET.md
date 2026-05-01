# Render Step 1 Environment Sheet

Use this sheet when creating the Render Web Service. Values marked with `<...>` must be replaced before the first production boot.

Render hosts the API only. Point the Vercel frontend at the Render API origin with `NEXT_PUBLIC_API_URL`; API routes use `/api/v1/*` except `/health` and `/docs`.

Run `npm run preflight:env` locally with the same values, or let Render run it through the blueprint build command, before treating the environment as deploy-ready.

## Core

```text
NODE_ENV=production
PORT=3000
APP_URL=https://your-render-service.onrender.com
APP_ORIGIN=https://your-render-service.onrender.com
CORS_ORIGIN=https://your-frontend-origin.example
DB_SYNCHRONIZE=false
```

## Authentication

```text
JWT_SECRET=<unique-random-secret-at-least-32-characters>
JWT_EXPIRES_IN=24h
ADMIN_PASSWORD=<unique-admin-password>
OPERATOR_PASSWORD=<unique-operator-password>
VIEWER_PASSWORD=<unique-viewer-password>
```

Production startup fails if `JWT_SECRET` is missing, shorter than 32 characters, or set to a known demo/placeholder value. Production startup also fails if any role password is missing or set to defaults such as `admin123`, `operator123`, `viewer123`, `password`, `changeme`, or `change-me-*` placeholders.

Generate a JWT secret with a command such as:

```bash
openssl rand -base64 48
```

## Supabase PostgreSQL

```text
DB_HOST=<supabase-db-host>
DB_PORT=5432
DB_USERNAME=<supabase-db-user>
DB_PASSWORD=<supabase-db-password>
DB_DATABASE=<supabase-db-name>
```

## Upstash Redis

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

Production preflight accepts either form. If `REDIS_URL` is used in production, it must use `rediss://`.

## Gateway Secrets From render.yaml

```text
STRIPE_API_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_CLIENT_SECRET=<paypal-client-secret>
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=<paypal-webhook-id>
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>
```

Provider webhook URLs:

```text
Stripe:   https://your-render-service.onrender.com/api/v1/webhooks/stripe
PayPal:   https://your-render-service.onrender.com/api/v1/webhooks/paypal
Razorpay: https://your-render-service.onrender.com/api/v1/webhooks/razorpay
```

## Render Commands

```text
Build Command: npm ci && npm run preflight:env && npm run build-check
Start Command: npm run start:prod
Health Check Path: /health
```

## Database Migration Check

Before treating the first boot as production-ready, apply the SQL files in `supabase/migrations` to Supabase. Existing databases created from the older baseline should also run `002_align_webhook_event_schema.sql` to align webhook duplicate references and event type width.

## Frontend Check

Set the frontend environment to the deployed API origin:

```text
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com
```
