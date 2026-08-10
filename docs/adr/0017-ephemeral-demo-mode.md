# 0017 — Ephemeral, Client-Only Demo Mode

- **Status:** Accepted
- **Date:** 2026-07-27
- **Type:** Architecture / Product

## Context

Visitors should be able to **explore the app before joining** — a "Try the demo"
that shows a lived-in family board, with the guarantee that **all demo data is
gone within 30 minutes of login**. Constraints: frontend-only on Firebase
(ADR-0001/0002), currently the free Spark plan (no Cloud Functions), and the app
already has in-memory repository implementations behind every board's interface.

## Options Considered

| Option | Assessment |
|--------|------------|
| **Client-only ephemeral demo (chosen)** | Seed the existing in-memory repositories, play a guest of a sample family, never write to Firebase. "Delete after 30 min" is inherent — nothing was persisted; a timer resets it. No backend, no cost, zero risk to real data. Trade-off: it's a sandbox (not shared/persisted), which is exactly what a pre-signup demo should be. |
| Firebase anonymous auth + real Firestore + timed cleanup | Real writes need isolation (a `demo` flag + rules) and a **Cloud Function** to delete expired data (Blaze). Firestore TTL policies delete only within ~24–72h, so they can't honour 30 minutes on their own. High effort + cost + imprecise. |
| One shared demo account | Concurrent visitors would see and clobber each other's data; per-session deletion isn't feasible. Rejected. |

## Decision

A demo mode that swaps every board's repository for a **freshly seeded in-memory
store**, entered from a "Try the demo" button on the sign-in page.

- **Swappable repositories:** each `*RepositoryInstance` now exports a `switchable`
  proxy (`features/app/switchableRepository`) plus a setter. `activateDemo()`
  (`features/demo/demoRepositories`) creates seeded `InMemory*` repositories and
  points all six proxies (tasks, notices, lost & found, pantry, questions,
  **notifications**) at them; `deactivateDemo()` restores the real ones. No
  component, hook, or test changes — consumers keep importing the same instance,
  and re-subscription happens naturally because the demo uses a different
  `familyId`.
- **Auth/family:** `AuthProvider` gains `isDemo` / `startDemo`; the guest is a
  fixed `DEMO_USER` and `status` is forced `authenticated` while demoing (real
  auth changes are ignored). `FamilyProvider` short-circuits to a ready-made
  sample family. A **30-minute `setTimeout`** ends the demo (restores repos,
  signs out); reload also ends it (nothing is persisted). A sticky **DemoBanner**
  shows a live countdown and an exit.
- **Seed content** (`features/demo/demoData`): the Kolkata "Ghosh Bari" household
  — mundane, witty, and dated relative to *today* so the dashboard always shows
  overdue / due-soon / upcoming, with a few already-closed items (for Recently
  closed) and notifications from other members (so the guest has unread).

## Consequences

**Positive:** works today with no backend, no Blaze, no rules changes; the
30-minute wipe is guaranteed by construction (demo data never leaves the
browser); the swappable-proxy seam is reusable and test-safe (tests inject repos
directly and never touch the proxy).

**Negative / costs:** the demo is a **sandbox** — changes aren't shared across
devices or persisted (correct for a pre-signup try, but not a multi-user
preview); a module-level proxy carries a small amount of shared mutable state
(contained to the instance files, reset on exit); a signed-in real user who
starts the demo is treated as the guest until they exit.

**Deferred:** a shared/persisted demo (would need Option B's anonymous auth +
Cloud Function); a demo entry point on the landing hero (currently on the
sign-in page, reachable via "Open app").

**Cross-references:** ADR-0001/0002 (frontend-only on Firebase), ADR-0013
(in-memory repositories / soft delete), ADR-0007 (i18n — demo strings en/bn).
`features/demo/*`, `features/app/switchableRepository`.
