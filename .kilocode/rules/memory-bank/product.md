# Product Context: PayNest

## Why This Product Exists

PayNest exists to demonstrate more than API correctness. It aims to show how payment orchestration, webhook durability, refund operations, and reliability telemetry can be packaged as a credible product experience for clients, reviewers, and operators.

## Problems It Solves

1. **Operational visibility**: makes transaction, refund, and webhook state legible through one hosted surface
2. **Reliability storytelling**: exposes backlog, replay posture, signatures, and recent flow instead of hiding them behind internal tools
3. **Demo realism**: provides a polished landing page and dashboard flow that feels closer to a SaaS product than a raw API sandbox
4. **Portfolio credibility**: lets reviewers inspect both the UX narrative and the underlying API/Swagger surface

## User Flow

1. visitor lands on `/`
2. visitor sees product positioning and demo access details
3. visitor signs in with demo credentials
4. visitor enters the hosted dashboard
5. visitor explores transactions, webhooks, reliability, gateways, refunds, and analytics
6. advanced reviewers validate backend behavior through `/docs` and live endpoints

## UX Goals

- make the first impression feel professional and client-ready
- keep the dashboard honest about missing or failing live data
- use operational telemetry as a product advantage, not just a backend implementation detail
- preserve same-origin deployment simplicity for live demos

## Current Product Surface

- landing page at `/`
- demo login gate
- dashboard views for Overview, Transactions, Webhooks, Reliability, Gateways, Refunds, and Analytics
- Swagger docs at `/docs`

## Integration Points

- PostgreSQL for transactions, refunds, analytics, webhooks, and audit trail
- Redis for idempotency and retry support
- Stripe test credentials for the most credible live demo path
