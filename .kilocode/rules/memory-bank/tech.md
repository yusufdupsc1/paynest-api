# Technical Context: PayNest

## Technology Stack

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| NestJS | 10.x | Backend framework |
| TypeScript | 5.x | Application typing |
| TypeORM | 0.3.x | ORM and entity persistence |
| PostgreSQL | current | Primary data store |
| Redis / Upstash | current | Idempotency and retry support |
| Swagger | 7.x | Live API documentation |
| Jest | 29.x | Validation across unit/integration/e2e/regression suites |
| Tailwind via CDN | current | Styling for hosted static dashboard |
| Bun + npm-compatible CLIs | current | Local package/runtime preference plus host compatibility |

## Development Environment

### Prerequisites

- Bun installed for local workflow
- Node.js 20+ for compatibility with hosts and tooling
- PostgreSQL available for full local behavior
- Redis available for idempotency/retry features

### Commands

```bash
bun install
bun run start:dev
bun run build
bun run lint-check
bun run type-check
bun run test:unit
bun run test:integration
bun run test:e2e
bun run test:regression
```

## Project Configuration

### App bootstrap

- [src/main.ts](src/main.ts:1) bootstraps Nest and Swagger
- [src/app.factory.ts](src/app.factory.ts:3) centralizes validation and CORS behavior
- [src/app.module.ts](src/app.module.ts:21) wires modules, TypeORM, Redis, and static serving

### Static UI

- [public/dashboard.html](public/dashboard.html) contains the landing page, demo login, and dashboard shell
- frontend fetches must stay aligned with actual controller routes

### Validation Surface

- [jest.config.ts](jest.config.ts) splits tests into unit, integration, e2e, and regression projects
- [eslint.config.mjs](eslint.config.mjs) covers source and tests

## Key Dependencies

### Production

- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/swagger`
- `@nestjs/typeorm`
- `typeorm`
- `pg`
- `ioredis`
- `stripe`

### Development

- `typescript`
- `jest`
- `ts-jest`
- `supertest`
- `@nestjs/testing`
- ESLint TypeScript tooling

## File Structure

```
/
├── package.json
├── render.yaml
├── DEPLOYMENT.md
├── SPEC.md
├── public/
│   └── dashboard.html
├── src/
│   ├── app.factory.ts
│   ├── app.module.ts
│   ├── main.ts
│   ├── gateways/
│   ├── common/
│   ├── config/
│   └── modules/
├── supabase/migrations/
└── test/
```

## Technical Constraints

- The root UI is static HTML, not a React/Next.js app.
- Same-origin deployment is the preferred live-demo posture.
- Demo login is currently a presentation-safe client-side gate, not full authentication.
- Render compatibility matters alongside local Bun-based workflows.

## Deployment

### Live host expectations

- single web service serving both UI and API
- working PostgreSQL and Redis configuration
- Stripe test credentials for the most practical live payment/webhook demo
- `APP_ORIGIN` configured for CORS allowlisting

### Important environment variables

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD` when needed
- `APP_ORIGIN`
- `STRIPE_API_KEY`
- `STRIPE_WEBHOOK_SECRET`
