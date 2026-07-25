# Architecture Decision Records

This folder contains the Architecture Decision Records (ADRs) for the Flying Fridge project.

## What is an ADR?

An ADR is a short, immutable document that captures a significant architectural or technical decision — the context that made it necessary, the realistic options that were considered (with their trade-offs), the option chosen, and its consequences (good and bad).

ADRs are **append-only**. When a decision is reversed, a new ADR is written that supersedes the old one; the old record is updated to say "Superseded by ADR-XXXX". History is never silently rewritten.

## Format

Each ADR follows this structure:

```
# NNNN — Title

- **Status:** Accepted | Superseded by NNNN | Deprecated
- **Date:** YYYY-MM-DD
- **Type:** Architecture | Technology | Process

## Context
Why this decision was needed.

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| ...    | ...  | ...  |

## Decision
What was chosen and the key reason.

## Consequences
What becomes easier, what becomes harder, what is explicitly deferred.
```

## Numbering

Files are named `NNNN-short-slug.md` where `NNNN` is a zero-padded four-digit integer, incrementing monotonically. Gaps are intentional (a pulled ADR is not renumbered).

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [0001](0001-frontend-only-react-spa.md) | Frontend-Only React SPA | Accepted | 2026-07-25 |
| [0002](0002-firebase-as-backend.md) | Firebase as the Backend Platform | Accepted | 2026-07-25 |
| [0003](0003-typescript.md) | TypeScript as the Project Language | Accepted | 2026-07-25 |
| [0004](0004-vite-build-tool.md) | Vite as Build Tool and Dev Server | Accepted | 2026-07-25 |
| [0005](0005-pnpm-package-manager.md) | pnpm as the Package Manager | Accepted | 2026-07-25 |
| [0006](0006-pwa-with-push-notifications.md) | PWA with Push Notifications | Accepted | 2026-07-25 |
| [0007](0007-react-i18next-internationalisation.md) | Internationalisation via react-i18next | Accepted | 2026-07-25 |
| [0008](0008-accessibility-baseline.md) | Accessibility Baseline — WCAG 2.1 AA | Accepted | 2026-07-25 |
| [0009](0009-testing-strategy.md) | Testing Strategy — Vitest + RTL | Accepted | 2026-07-25 |
| [0010](0010-client-side-routing-react-router.md) | Client-Side Routing via React Router | Accepted | 2026-07-25 |
| [0011](0011-landing-page-static-markup.md) | Landing Page Ported as Static Markup | Accepted | 2026-07-25 |
