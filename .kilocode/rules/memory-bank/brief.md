# Project Brief: PayNest Payment Orchestration Demo

## Purpose

PayNest is a NestJS-based payment orchestration and webhook reliability platform demo. It is designed to present a believable SaaS product surface: a professional landing page, a demo login handoff, and a live operations dashboard backed by real API responses.

## Target Users

- clients evaluating payment operations software
- hiring teams reviewing backend reliability and product thinking
- developers extending a multi-gateway payments platform

## Core Use Case

Users should be able to:

1. land on a polished product page at `/`
2. sign in with demo credentials
3. enter a live dashboard showing transactions, webhooks, reliability, gateways, refunds, and analytics
4. inspect API behavior through Swagger and live endpoints

## Key Requirements

### Must Have

- NestJS backend with TypeScript
- PostgreSQL persistence via TypeORM
- Redis-backed idempotency / retry support
- static hosted dashboard in [public/dashboard.html](public/dashboard.html)
- professional landing page and demo login handoff
- accurate deployment posture for Render or similar hosts
- passing build, lint, and type checks

### Nice to Have

- broader automated regression coverage
- richer demo authentication beyond static credentials
- clearer operator and reviewer narratives in docs and UI

## Success Metrics

- successful Render deployment
- dashboard loads against the real mounted API routes
- Stripe-backed demo flow works with configured test credentials
- webhook reliability and health views surface meaningful live telemetry

## Constraints

- the current UI is static HTML served by NestJS, not a separate SPA/Next.js frontend
- deployment should remain simple and same-origin when possible
- documentation and memory-bank files must reflect the real project rather than a starter template
