# 0001 — Frontend-Only React SPA

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Architecture

## Context

Flying Fridge is a family noticeboard — a relatively small, data-driven CRUD product with real-time sync requirements and a mobile-first audience (see `requirements/overview.md`). The team is a solo developer, and time-to-feature velocity matters. The question is whether to maintain a custom backend server alongside the frontend, or to off-load all server-side concerns to a managed platform.

The landing page (`index.html` at the repo root) was already built as a self-contained file (`requirements/requirement-1.md`). Requirement 2 (`requirements/requirement-2.md`) formalises the target stack: "a frontend-only React app backed by Firebase."

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **React SPA + Firebase (no custom server)** | No server to deploy or operate; Firebase handles auth, DB, push, hosting; fast path from idea to running feature | All backend logic must fit Firebase's model; vendor-locked (see ADR-0002); client-side security rules are the only server-side boundary |
| React SPA + custom Node/Express API | Full control over API shape and server-side logic | Requires deployment, ops, API versioning, and CORS management; doubles the surface area for a solo developer |
| Next.js (SSR/SSG) + Firebase | SSR improves SEO; same Firebase backend option | Server components add operational complexity; the app is auth-gated (SEO is not a priority for the board itself); overkill for phase 1 |
| Remix or other full-stack framework | Unified data loading, good DX | Same ops overhead as custom server; Firebase adapters are less mature |

## Decision

Build a **React SPA with no custom backend server**. All backend concerns — authentication, database, push notifications, hosting — are delegated to Firebase (see ADR-0002). The app will be a statically deployable bundle.

## Consequences

**Positive:**
- No server to provision, monitor, or patch; deployment is a static file upload.
- Firebase SDKs run client-side; adding a new data feature requires only Firestore collection + security rules, not a new API endpoint.
- Fits the project's velocity constraint: a solo developer can move quickly without context-switching between frontend and backend codebases.

**Negative / costs:**
- All business logic that would normally live in a trusted server process must be enforced via Firestore security rules. These rules must be tested carefully; a gap is a real security hole.
- Server-side rendering is unavailable. SEO for the marketing landing page is limited to static metadata; the app shell is auth-gated so this is an acceptable trade-off for now.
- If a requirement arises that genuinely needs server-side execution (e.g. a webhook receiver, a cron job, secret-holding integration), a Firebase Cloud Function or Cloud Run service must be added — that decision would warrant a new ADR.

**Deferred:**
- Server-side rendering / edge rendering is explicitly out of scope for the current phase.
- Cloud Functions for any server-side logic are deferred until a concrete requirement demands them.
