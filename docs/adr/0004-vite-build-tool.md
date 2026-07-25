# 0004 — Vite as Build Tool and Dev Server

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Technology

## Context

The project is moving from a zero-build single HTML file (`index.html`, Requirement 1) to a TypeScript React application (Requirement 2, `requirements/requirement-2.md`). A build tool and dev server must be chosen. Requirements: TypeScript + React transpilation, fast hot-module replacement for a good developer experience, PWA/service-worker support (see ADR-0006), and compatibility with pnpm (see ADR-0005).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Vite** | Native-ESM dev server starts instantly regardless of project size; HMR is fast; first-class React and TypeScript support via plugins; `vite-plugin-pwa` (Workbox) is the standard PWA integration; excellent Vitest integration (ADR-0009) | Rollup-based production bundle differs from the esbuild dev transform — rare edge cases; relatively young compared to webpack |
| Create React App (Webpack) | Battle-tested; large community | Slow dev server; effectively unmaintained since 2023; ejecting is painful |
| Webpack (bare) | Maximum configurability | Configuration complexity; slow cold starts; no built-in Vite-equivalent DX |
| Parcel | Zero-config, fast | Less ecosystem support for PWA plugins; Vitest does not have a Parcel integration |
| Next.js | Built-in routing, SSR, image optimisation | Includes SSR which ADR-0001 explicitly rejects; larger abstraction; forces a file-system router |

## Decision

Use **Vite** as the build tool and development server. The project is bootstrapped with `vite` + `@vitejs/plugin-react`, written in `vite.config.ts`. Production builds output a static bundle deployable to Firebase Hosting or any static host.

## Consequences

**Positive:**
- Cold dev server start is sub-second even as the codebase grows; HMR updates are near-instant.
- `vite-plugin-pwa` provides the Workbox service-worker integration needed for PWA and offline support (see ADR-0006) with minimal configuration.
- Vitest shares Vite's transform pipeline, so tests run against the same TypeScript/JSX resolution as the application (see ADR-0009).
- pnpm + Vite is a well-tested combination with no known compatibility issues.

**Negative / costs:**
- The dev build (esbuild) and production build (Rollup) use different transformers. Rare syntax edge cases can behave differently in development vs. production; running `vite build` in CI catches these.
- Vite's native-ESM approach requires modern browsers in development. Supporting very old browsers requires additional Rollup plugins and `@vitejs/plugin-legacy`, which is not needed for this project's mobile-first audience but worth noting.
- Vite configuration is TypeScript (`vite.config.ts`) which must be maintained alongside the app's own `tsconfig.json`; path aliases must be declared in both.
