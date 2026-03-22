# Development Rules

## Critical Rules

- Primary app stack is NestJS + TypeScript, not Next.js.
- Prefer Bun-oriented commands for local guidance, but keep deployment/build compatibility with installed CLIs and npm-based hosts such as Render when needed.
- Do not assume `/api/v1` exists unless code explicitly mounts it.
- When changing the hosted UI in [public/dashboard.html](public/dashboard.html), preserve same-origin deployment compatibility with the mounted NestJS controller routes.
- After significant changes, update the memory bank in [.kilocode/rules/memory-bank/context.md](.kilocode/rules/memory-bank/context.md).

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies locally |
| `bun run start:dev` | Run NestJS in watch mode |
| `bun run build` | Production build |
| `bun run lint-check` | Non-mutating ESLint run |
| `bun run type-check` | Non-mutating TypeScript check |
| `bun run test:unit` | Unit tests |
| `bun run test:integration` | Integration tests |
| `bun run test:e2e` | End-to-end tests |
| `bun run test:regression` | Regression tests |

## Backend Best Practices

- Keep controllers aligned with the documented live deployment contract in [DEPLOYMENT.md](DEPLOYMENT.md).
- Preserve webhook durability, replay guardrails, audit logging, and health telemetry when refactoring modules.
- Prefer explicit typing for TypeORM entities and nullable fields to avoid build-time overload regressions.
- Treat Render deployment compatibility as part of the implementation surface, not an afterthought.

## Frontend / Hosted Dashboard Best Practices

- The root experience should feel client-ready and professional.
- Preserve the demo login handoff before exposing the dashboard.
- Keep dashboard API requests consistent with actual mounted backend routes.
- Fail honestly into a connection-error state when required live telemetry is unavailable.

## Code Quality

- Prefer non-mutating validation commands before finalizing changes.
- Write descriptive commit messages.
- When documentation or deployment behavior changes, update [SPEC.md](SPEC.md), [DEPLOYMENT.md](DEPLOYMENT.md), or both as appropriate.
