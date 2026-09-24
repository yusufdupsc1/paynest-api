# PayNest — Production Readivness Plan

## Goal
Unblock the build/deploy, then harden core payment invariants (idempotency, refunds, webhooks) before tackling auth/DTO/circuit-breaker/observability. No money-integer refactor in this pass.

## Resolved decisions (recommended defaults)
- **D1 Package manager**: standardize on Bun (Dockerfile already uses it). Render `env: docker` + existing Dockerfile so the build matches local/docker-compose. Remove broken `migration:*` npm scripts (schema is managed via `supabase/migrations/*.sql`).
- **D2 Idempotency**: atomic reserve via single Redis `SET key NX EX 86400`. In-memory cache stays for local dev only; if Redis is unreachable in production, fail closed for new payments.
- **D3 Refunds**: DB transaction + conditional `UPDATE ... WHERE refundedAmount + :amt <= amount AND status=COMPLETED`; gateway idempotency key = `refund:<idempotencyKey>`; make `externalRefundId` unique (or dedupe).
- **D4 Webhooks**: raw-body preservation for signature-sensitive gateways (Stripe/Razorpay/Bkash); pass raw buffer to verify. Ack-then-process.
- **D5 DTOs**: class-validator classes + global `ValidationPipe({ whitelist, transform, forbidNonWhitelisted })` + express body-size limit.
- **D6 Authz**: `@Roles(Role.ADMIN, Role.OPERATOR)` on refund writes + transaction/refund list; `@Roles(Role.VIEWER, Role.OPERATOR, Role.ADMIN)` on analytics reads.
- **D7 Resilience**: opossum circuit breakers + `AbortController` timeouts around gateway HTTP (PayPal `fetch`) and Stripe SDK calls.
- **D8 Money**: deferred (Phase 3 optional). Decimal column + `Math.round(amount*100)` accepted if invariants enforced.
- **D9 Health**: split `/health` (liveness, no DB) and `/health/ready` (readiness: DB+Redis); Render `healthCheckPath: /health/ready`.

## Verified current state (corrects prior summary)
- No `.github/workflows`; no CI pipeline. Deployment = Render + Docker. Release gate is a local npm script only.
- No `package-lock.json`; lockfile is `bun.lock`. `package.json` `test:*` scripts use `npm run`; `migration:*` point to missing `src/config/data-source.ts`.
- TS errors: `src/app.module.ts:42,101` (`err.message` on `unknown`). `bun run build-check` fails.
- Idempotency: `checkAndStore` is non-atomic (GET then SET).
- Refunds: non-atomic read/check/increment; no gateway idempotency key; `externalRefundId` index not unique; no `updatedAt`.
- Transaction `updateStatus`: read-modify-save, last-write-wins, no optimistic lock.
- Payment create: gateway call occurs before DB persist -> duplicate-charge risk under races.
- Webhooks: Stripe `constructEvent` receives `JSON.stringify(parsedBody)`, not raw bytes -> signature mismatch in prod. PayPal sends parsed object to its verify API (acceptable).
- Controllers: `RefundsController` and `AnalyticsController` have no `@Roles()` -> any authenticated user can act/read.
- Gateways: `opossum` installed but unused; PayPal `fetch` has no timeout/AbortController.

## Ordered implementation tasks

### Phase 0 — Deploy unblock (P0)
1. `src/app.module.ts`: fix `err.message` (lines 42, 101) -> `err instanceof Error ? err.message : String(err)`.
2. `render.yaml`: switch to `env: docker`, remove inline `buildCommand`/`startCommand`/`envVars` (let Dockerfile drive); keep env var declarations only as `sync: false` secrets. Update local `docker-compose.yml` env file accordingly.
3. `package.json`: remove broken `migration:*` scripts (or add a real `src/config/data-source.ts`). Delete any reliance on `npm ci`.
4. Validate: `bun run typecheck` and `bun run build-check` pass.

### Phase 1 — Payment safety (P0/P1)
5. `IdempotencyService`: add `reserveAndStoreAtomic(key, txId)` using `redis.set(key, txId, 'NX', 'EX', 86400)`; return `true` only if newly set. Keep fallback read path.
6. `TransactionsService.createPayment`: reserve idempotency first; if reserve fails (key taken), look up stored tx id and return it WITHOUT calling gateway. Persist transaction inside a DB transaction with the idempotency key (already unique-indexed) as a guard; on unique-violation fallback, return existing.
7. `RefundsService.createRefund`: wrap in TypeORM `queryRunner` transaction; atomically verify available amount and COMPLETED status via conditional update; pass gateway idempotency key; on success increment `refundedAmount` and transition status; record externalRefundId; make `externalRefundId` unique in entity.
8. `Transaction.updateStatus`: use optimistic conditional update (lock row or version column) to prevent lost status writes from concurrent webhooks/user actions.
9. Validate: unit tests for concurrency + idempotency; `test:unit`, `test:integration` pass.

### Phase 2 — Webhooks security (P1/P2)
10. `WebhooksController` + `main.ts`/`app.factory`: enable raw-body preservation (e.g. `express.raw`/`body-parser` with `verify` capturing raw) for `/webhooks/stripe`, `/webhooks/razorpay`, `/webhooks/bkash`; pass raw Buffer/string to gateway `verifyWebhook`.
11. Ack-then-persist-then-process: confirm current flow already returns 200 before processing; ensure failures go to retry queue, not error propagated to provider.
12. Validate: Stripe signature verification test; duplicate webhook idempotency still 200 + dedupe.

### Phase 3 — Validation, authz, resilience (P2)
13. Convert `CreatePaymentDto`/`CreateRefundDto` to validated classes; register global `ValidationPipe`; set `express.json({ limit: '1mb' })`.
14. Add `@Roles()` to `RefundsController` write/list and `AnalyticsController` reads.
15. Add opossum circuit breaker + `AbortController` timeout to PayPal/Razorpay gateway HTTP; apply to Stripe SDK calls where feasible.
16. Validate: `lint-check`, `type-check`, `test:e2e`, `test:regression` pass.

### Phase 4 — Observability (P3 / optional)
17. `HealthController`: `/health` returns liveness only; `/health/ready` checks DB+Redis. Update Render `healthCheckPath` to `/health/ready`.
18. (Optional, deferred) Money refactor to integer cents / `decimal.js`.
19. Final: `test:release-gate` (skip flaky perf-smoke or stabilize threshold).

## Validation order (commands)
```
bun install --frozen-lockfile && \
bun run lint-check && \
bun run type-check && \
bun run build-check && \
bun run test:unit -- --runInBand && \
bun run test:integration -- --runInBand && \
bun run test:e2e -- --runInBand && \
bun run test:regression -- --runInBand && \
bun run test:deploy-readiness
```

## Key files
- `src/app.module.ts:42,101` (TS errors)
- `render.yaml` (npm ci vs bun)
- `src/modules/transactions/idempotency.service.ts` (non-atomic)
- `src/modules/transactions/transactions.service.ts` (createPayment/F5)
- `src/modules/refunds/refunds.service.ts` (D3)
- `src/gateways/stripe/stripe.gateway.ts` (raw body)
- `src/modules/refunds/refunds.controller.ts` and `src/modules/analytics/analytics.controller.ts` (authz)
- `src/modules/health/health.controller.ts` (D9)
- `src/modules/transactions/transactions.controller.ts:39` (DTO mutation) 

## Risks / migration
- Idempotency algorithm change must preserve 24h dedupe window and not reject legitimate retries.
- Refund DB transactions require TypeORM `queryRunner` wrapping; test partial-refund concurrency.
- Raw-body middleware scope must be limited to webhook routes to avoid corrupting JSON API parsing.
- Render `env: docker` + Alpine-based Dockerfile must support Node runtime for TypeORM pg TLS to Supabase; verify connection family=4 in deploy.
- Schema alignment between TypeORM entities and `supabase/migrations/*.sql` should be validated in Phase 0.
