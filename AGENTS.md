## Project Instruction Surface

This repository is **not** a base template anymore. It is an active NestJS payment orchestration and webhook reliability demo called PayNest.

Primary instruction sources live under [.kilocode/rules](.kilocode/rules).

## Optional Feature Guides

When users request features beyond the current platform scope, check for available recipes in [.kilocode/recipes](.kilocode/recipes).

### Available Recipes

| Recipe | File | When to Use |
| ------ | ---- | ----------- |
| Add Database | [.kilocode/recipes/add-database.md](.kilocode/recipes/add-database.md) | Only if the user asks to replace or expand the current persistence strategy beyond the existing PostgreSQL + Redis foundation |

### How to Use Recipes

1. Read the relevant recipe before implementation.
2. Adapt it to the current NestJS architecture instead of assuming a starter-template baseline.
3. Update the memory bank after implementation.

## Memory Bank Maintenance

After completing significant work, update:

- [.kilocode/rules/memory-bank/context.md](.kilocode/rules/memory-bank/context.md)
- other memory bank files when project goals, architecture, deployment posture, or tech stack change

## Current Product Direction

- Public root experience is a professional landing page with demo login handoff.
- The live product experience is the operational dashboard served from [public/dashboard.html](public/dashboard.html).
- The backend is a NestJS API with payments, refunds, webhook inbox/replay, analytics, audit logging, and health telemetry.
- Render deployment and same-origin API compatibility are first-class concerns.
