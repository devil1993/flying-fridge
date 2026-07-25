# 0009 — Testing Strategy — Vitest + React Testing Library

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Process / Technology

## Context

`requirements/requirement-2.md` asks for "test cases so that we can perform proper TDD later on." The test infrastructure must be in place before features are built so that future requirement cycles can drive development test-first. The `.claude/agents/test-engineer.md` agent specification confirms the expected stack: Vitest, Testing Library, fake-indexeddb, and Playwright. The test runner must integrate with Vite (ADR-0004) and TypeScript (ADR-0003) without a separate transpilation layer.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Vitest + React Testing Library + jsdom** | Vitest reuses Vite's transform pipeline — same tsconfig, same aliases, no extra babel config; RTL enforces user-centric queries; jsdom provides a DOM environment; fast parallel test runs | jsdom is not a real browser — some Web APIs (Service Workers, WebPush, certain CSS) require workarounds or mocks |
| Jest + React Testing Library | Mature; enormous community | Requires separate Babel or SWC transform configuration; slower startup; config drift between Jest transform and Vite transform is a persistent pain point |
| Vitest + Enzyme | Vitest DX is excellent | Enzyme tests implementation details (internal state, lifecycle); testing-library's user-centric approach is a better fit for a component-heavy family app |
| Playwright only | Tests in a real browser; catches layout regressions | Slow (seconds per test); not suited for unit/component TDD loops; no component-level isolation |

## Decision

Adopt the following **three-layer testing strategy**:

1. **Unit tests (Vitest + jsdom)** — pure functions, hooks, utility modules. Fast, many, run on every save. Files co-located with source as `*.test.ts` / `*.test.tsx`.
2. **Component / integration tests (Vitest + React Testing Library + jsdom)** — render components with real routing (inside the app's router) and real state; assert on what a user sees and can do, using `getByRole`, `findByText`, etc. Seed state directly where needed; never assert on internal structure.
3. **End-to-end tests (Playwright) — planned, not yet set up.** Reserved for the highest-value user journeys (login, family join, add a board item). Deferred until there is a running app with real Firebase emulators.

Test environment: `jsdom` (specified in `vitest.config.ts` as `environment: 'jsdom'`).

## Consequences

**Positive:**
- Vitest uses the same Vite config, so path aliases (`@/`), TypeScript compilation, and environment variables resolve identically in tests and in the running app — no "works in test, breaks in prod" transform surprises.
- RTL's user-centric queries (`getByRole`, `findByLabelText`) align directly with the accessibility baseline (ADR-0008): if a component is hard to test with RTL, it is probably not accessible.
- Parallel test execution is fast enough for TDD inner loops (sub-second for unit tests on a dev machine).

**Negative / costs:**
- **jsdom is not a real browser.** `window.matchMedia`, Service Worker APIs, and Web Push are not implemented in jsdom; tests that need them require explicit mocks. Service-worker behaviour can only be tested in Playwright.
- Firebase SDK calls in components must be mocked at the module boundary in unit and component tests. This adds boilerplate and means tests do not cover the Firestore security rules or network path.
- The Playwright layer is intentionally deferred. Until it exists, there is no test coverage of the actual login → board flow in a real browser. This is a known gap.
- Co-locating tests with source files (`.test.tsx` next to the component) means the `src/` tree contains both implementation and test files. Some developers prefer a separate `__tests__` directory; this project prefers co-location for discoverability.

**Deferred:**
- Playwright e2e setup — deferred to when the first real user journey (auth + board CRUD) is implemented.
- Firebase Emulator Suite integration in CI — deferred alongside Playwright; needed for realistic e2e tests.
- Coverage reporting thresholds — deferred; will be meaningful once there is substantial feature code to measure against.
