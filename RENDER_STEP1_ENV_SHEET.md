# Render Step 1 — Environment Variables Sheet

Use this sheet to configure the backend service on Render for your live frontend:

- Frontend: `https://paynesto.vercel.app`
- Backend: `https://<your-render-service>.onrender.com`

## 1) Required for first successful boot

```bash
NODE_ENV=production
PORT=3000

APP_URL=https://<your-render-service>.onrender.com
APP_ORIGIN=https://paynesto.vercel.app
CORS_ORIGIN=https://paynesto.vercel.app

DB_SYNCHRONIZE=false
DB_HOST=<supabase-host>
DB_PORT=5432
DB_USERNAME=<supabase-user>
DB_PASSWORD=<supabase-password>
DB_DATABASE=<supabase-db>

REDIS_HOST=<upstash-host>
REDIS_PORT=<upstash-port>
REDIS_PASSWORD=<upstash-password>
REDIS_TLS=true

JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=24h
ADMIN_PASSWORD=<strong-admin-password>
OPERATOR_PASSWORD=<strong-operator-password>
VIEWER_PASSWORD=<strong-viewer-password>

STRIPE_API_KEY=<stripe-sandbox-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

## 2) Recommended gateway sandbox variables (next)

```bash
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_CLIENT_SECRET=<paypal-client-secret>
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=<paypal-webhook-id>

RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>
```

## 3) Vercel (frontend) variable to set

In the `paynest-frontend` Vercel project, add:

```bash
NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com
```

## 4) First verification after deploy

- `GET https://<your-render-service>.onrender.com/health`
- `GET https://<your-render-service>.onrender.com/docs`
- Login from frontend and confirm API calls are hitting Render domain (not localhost).

## 5) Render free-tier note

Render free web services can spin down after inactivity (cold starts). Expect delayed first response when idle.
