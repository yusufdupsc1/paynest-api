# Production Verification Standard

This repository now includes a release-gate workflow intended to represent a senior-level production readiness bar before deployment.

## Required automated gate

Run the full verification command from the repository root:

```bash
bun run test:release-gate
```

The release gate executes the following checks in order:

1. Static analysis via `bun run lint-check`
2. Type safety via `bun run type-check`
3. Unit coverage via `bun run test:unit -- --runInBand`
4. Integration coverage via `bun run test:integration -- --runInBand`
5. End-to-end coverage via `bun run test:e2e -- --runInBand`
6. Regression coverage via `bun run test:regression -- --runInBand`
7. Performance smoke validation via `bun run test:performance-smoke -- --runInBand`
8. Production build validation via `bun run build-check`

## Release acceptance checklist

Mark every item as complete before promoting a build:

- [ ] `bun run test:release-gate` completed successfully with no failures
- [ ] Health endpoint responds successfully on `/health`
- [ ] Hosted dashboard root loads successfully from the same deployment origin
- [ ] Payment return URLs resolve through the hosted root flow without localhost fallbacks
- [ ] Webhook verification, replay, analytics, refunds, and transaction paths were covered by automated suites
- [ ] Performance smoke expectations passed without regression
- [ ] Production environment variables are defined for app URL, database, Redis, and required gateway secrets
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
- If a release requires stricter coverage evidence, pair this process with `bun run test:cov` and archive the report with deployment notes.
