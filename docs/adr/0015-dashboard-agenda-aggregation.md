# 0015 — Dashboard Agenda: Cross-Module Aggregation & Relevant-Date Mapping

- **Status:** Accepted
- **Date:** 2026-07-26
- **Type:** Architecture / Design

## Context

`requirements/requirement-6.md` asks for a more informed dashboard: below the
module overview, a tap-switchable split of (1) **Recent items** across all types
within a few days of a focus date (undated ones at the bottom, colour-coded) and
(2) a **month calendar** with per-day dots for timed items; tapping a day opens
Recent focused on that date, with a "back to today" affordance. It is
**frontend-only** — no new backend, no new collection.

Two design questions had to be settled: **how to combine five independently
shaped collections into one time-ordered list**, and **what single "relevant
date" each item type contributes** (several have more than one date, or none).

## Options Considered

**Aggregation source**

| Option | Assessment |
|--------|------------|
| New `agenda`/denormalized Firestore collection written on every change | Rejected — needs write fan-out (or a Cloud Function), duplicates data, and violates "frontend-only". |
| **Client-side aggregation over the existing per-module subscriptions (chosen)** | The dashboard already subscribes to all five modules for its counts; fold those into one pure function. Zero new data, always consistent with the boards. |

**Relevant-date per type**

Each type contributes at most one date; items without one are *undated* and sink
to the bottom of Recent (and never get a calendar dot):

| Type | Relevant date | Why |
|------|---------------|-----|
| Tasks | `targetDate` | the due date is the scheduling moment |
| Notices | `date` | the day the notice is about |
| Pantry | `madeOn + keepsDays` (expiry) | "goes off Tuesday" is the calendar-worthy moment; undated if either part is missing |
| Lost & Found | — (undated) | a search has no scheduled day |
| Questions | — (undated) | no date in the model |

**Recent windowing.** After UAT feedback the window is **forward-only**: items
*before* the focus date form a separate **Overdue** group shown on top (priority,
all of them — not clipped to a window), and **Around** covers the focus date
through **+2 days**. Undated items follow. "Active" per type reuses each module's
own board predicate (`isOnBoard`, `isSearching`, `isInStock`, open/‌not-deleted)
so the agenda matches the overview counts exactly.

## Decision

Add a `features/dashboard` module with a **pure, unit-tested** `agenda.ts`
(`buildAgenda`, `recentAround`, `typesByDay`, `monthMatrix`, date helpers) and
three presentational components (`AgendaSplit` tabs, `RecentItems`,
`MonthCalendar`). `DashboardView` builds the agenda from the collections it
already has and renders `<AgendaSplit>` below the cards. State (active view +
focus date) lives in `AgendaSplit`; tapping a calendar day sets the focus and
switches to Recent; "back to today" resets it. The calendar shows the **current
month** only. Tabs follow the WAI-ARIA tabs pattern (roving arrow-key focus);
type colours reuse the existing `--mag-*` tokens; dates are localised via `Intl`
so English and Bengali both read naturally.

## Consequences

**Positive:** no new backend or collection; the agenda can never drift from the
boards; all date logic is pure and covered by tests; adding a future type is a
single `buildAgenda` case.

**Negative / costs:** aggregation is O(items) on every dashboard render (trivial
at family scale); Lost & Found and Questions never appear on the calendar and
always sit in the undated group by design; the calendar is current-month only
(no month navigation yet).

**Deferred:** month navigation (prev/next); per-type filters on Recent; showing
done/closed items in a "recently closed" view (tracked separately);
richer "relevant date" for Questions if a date field is added.

**Cross-references:** ADR-0012 (docs-currency — this change updates the C4 model,
data model, and Guide in the same change); reuses `noticeLogic`, `lostLogic`,
`pantryLogic`, and `lib/date`. `docs/design/data-model.md` §7 note.
