# Production Verification Standard

This repository now includes a release-gate workflow intended to represent a senior-level production readiness bar before deployment.

## Required automated gate

Run the full verification command from the repository root:

```bash
npm run test:release-gate
```

The release gate executes the following checks in order:

1. Static analysis via `npm run lint-check`
2. Type safety via `npm run type-check`
3. Unit coverage via `npm run test:unit -- --runInBand`
4. Integration coverage via `npm run test:integration -- --runInBand`
5. End-to-end coverage via `npm run test:e2e -- --runInBand`
6. Regression coverage via `npm run test:regression -- --runInBand`
7. Performance smoke validation via `npm run test:performance-smoke -- --runInBand`
8. Production build validation via `npm run build-check`

For a faster deployment-environment check, run:

```bash
npm run test:deploy-readiness
```

The deploy-readiness command executes these focused checks:

1. Environment preflight via `npm run preflight:env`
2. Type safety via `npm run -s type-check`

## Release acceptance checklist

Mark every item as complete before promoting a build:

- [ ] `npm run test:release-gate` completed successfully with no failures
- [ ] `npm run test:deploy-readiness` completed successfully with the target deployment environment
- [ ] Health endpoint responds successfully on `/health`
- [ ] Vercel frontend is configured with `NEXT_PUBLIC_API_URL` pointing to the Render API origin
- [ ] Backend API routes respond under `/api/v1/*`, with `/health`, `/health/gateways`, and `/docs` excluded from the prefix
- [ ] Payment return URLs resolve through the hosted root flow without localhost fallbacks
- [ ] Webhook verification, replay, analytics, refunds, and transaction paths were covered by automated suites
- [ ] Provider webhook URLs are configured as `/api/v1/webhooks/stripe`, `/api/v1/webhooks/paypal`, and `/api/v1/webhooks/razorpay`
- [ ] Webhook inbox/detail access is limited to admin/operator users and generic webhook ingestion fails closed
- [ ] Performance smoke expectations passed without regression
- [ ] Production environment variables are defined for app URL, database, Redis, and required gateway secrets
- [ ] Supabase migrations in `supabase/migrations` have been applied to the target database
- [ ] Deployment blueprint and operational docs are aligned with the current runtime behavior
- [ ] No generated build artifacts or local workspace metadata are tracked in Git
- [ ] Final branch history is clean, intentional, and ready for audit/review

## Expected evidence for a release candidate

For a production-grade artifact, attach or record the following with a release candidate:

- Git commit SHA that passed the gate
- CI or local command output showing all stages passed
- Environment/deployment target used for validation
- Any known operational limitations or deferred follow-up items

## Notes

- The release gate intentionally includes the focused performance smoke test even though it is part of the broader regression project. This makes the expected performance check explicit for release reviewers.
- If a release requires stricter coverage evidence, pair this process with `npm run test:cov` and archive the report with deployment notes.
