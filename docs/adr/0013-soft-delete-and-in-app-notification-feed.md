# 0013 — Preserve-by-Default (Soft Delete) and an In-App Notification Feed

- **Status:** Accepted
- **Date:** 2026-07-26
- **Type:** Architecture / Data model

## Context

`requirements/requirement-5.md` asks for family-wide **notifications** when
someone adds something to a board, and for the app to **never lose data** on
delete. Two follow-on clarifications from the product owner shaped this record:

1. *"Any delete from the app should not delete data — it should set a deleted
   marker."*
2. *"For tasks, whoever completes something automatically gets the assignment
   while closing it."*
3. *"Build notifications as a collection with real-time update; when installed as
   a PWA, keep them coming in the background."*

These are small individually but share a theme: the family board is a **shared,
long-lived record**, and members need to stay aware of changes to it. The
constraint that shapes the notification design is the stack: Flying Fridge is
**frontend-only on Firebase** (ADR-0001, ADR-0002), currently on the **Spark
(free) plan with no Cloud Functions**. Anything requiring a server-side sender is
therefore out of immediate reach.

## Options Considered

### Notifications delivery

| Option | Assessment |
|--------|------------|
| **A — `notifications` Firestore collection + `onSnapshot` (chosen for now)** | Works today with zero server code; each board appends a doc on add, every member subscribes for real-time in-app alerts (bell + unread badge). Cannot wake a closed app. |
| B — FCM web push only | Delivers when the app is closed, but needs a **server-side sender** (Cloud Function on Blaze) to actually push, plus per-device token management. Nothing to show until that backend exists. |
| C — Poll Firestore from a service worker in the background | **Not viable.** Service workers are event-driven and OS-killable; they cannot hold a listener or reliably poll while the app is closed. |

### Delete semantics

| Option | Assessment |
|--------|------------|
| Hard delete (`deleteDoc`) | Simple, but destroys family history irrecoverably and can't support undo/audit. Rejected. |
| **Soft delete — `deleted` marker, reads filter it out, rules deny hard delete (chosen)** | Preserves the timeline, enables a future restore view, and is enforceable in Security Rules. Costs a little query hygiene (must filter `deleted`). |

## Decision

### Decision 1 — Two-tier notifications; ship the in-app feed now

Introduce a family-scoped, **append-only** `notifications` collection
(`src/features/notifications/`, same repository pattern as the boards: interface
+ in-memory + Firestore + instance selector). Each board's add action calls
`notifyItemAdded(familyId, module, excerpt, actor)`; every member subscribes via
`useNotifications`, surfaced as a **bell with a live unread badge** in the top
bar (`NotificationBell`).

- Only the **excerpt** (the author's verbatim words) is stored; the surrounding
  sentence is rendered from i18n (ADR-0007), so each member reads it in their own
  language (English/Bengali).
- **Read state is per-user and local** — a `lastSeen` timestamp in
  `localStorage`. Unread = added by someone else, after `lastSeen`. No extra
  writes, no cross-member contention.
- The feed is **immutable**: rules allow member `read` and own-authored `create`
  only (no update/delete); the client caps display to the 50 most recent.
- **Bridge toward background:** when a new entry arrives while the tab is
  unfocused (`document.hidden`) and OS permission is granted, the app raises a
  one-off `Notification`. This is the ceiling for a *page-alive* PWA.

**Background delivery when the app is closed is explicitly deferred.** It
requires FCM web push (§4 of the PWA doc) driven by a **Cloud Function on
`notifications/{id}` create** (Blaze plan) that fans out to members'
`users/{uid}.fcmTokens`. Because the in-app feed already writes those documents,
adding push later is **additive** — no client rework. This staging is the honest
answer to "keep notifications coming in the background": in-app + tab-alive OS
toast today, closed-app push once a sender exists.

### Decision 2 — Soft delete everywhere; the app never destroys data

Every "delete/remove" action **preserves the record**. Tasks and notices gain a
`deleted: boolean` marker: `remove()` sets `deleted: true` (+ `updatedAt`) and
subscriptions filter `deleted` items out. Modules that already have a terminal
status (`down`/`consumed`/`closed`) keep using it — those were never destructive.
**Firestore Security Rules deny hard `delete` on all five board collections**
(`allow delete: if false`), so the invariant holds even against a hand-crafted
client. The `notifications` feed is likewise non-deletable.

### Decision 3 — Completing a task auto-assigns it to the finisher

In `useTasks`, marking a task done also assigns it to the acting user (before the
status write), so "who did this?" always has an answer. Reopening leaves the
assignee untouched. This is a hook-level behaviour, so both repository
implementations get it for free.

## Consequences

**Positive:**
- Real-time family awareness ships **immediately** with no backend, no Blaze, no
  Cloud Function — the free-tier constraint is respected.
- The family timeline is now durable: nothing the UI does destroys history, and a
  "recently removed"/restore view becomes possible later with no schema change.
- Notification copy is fully localised because only language-neutral excerpts are
  stored.
- Push-when-closed is unblocked-but-additive: the data it needs already exists.

**Negative / costs:**
- **No closed-app delivery yet.** Users who expect phone push while the app is
  fully closed won't get it until the FCM sender is built — a real gap called out
  in the guide and PWA doc rather than hidden.
- **Read state is device-local.** `lastSeen` lives in `localStorage`, so unread
  counts don't sync across a member's devices. Acceptable for now; a
  `users/{uid}` field could replace it later.
- **Query hygiene.** Every board read must remember to filter `deleted`; a missed
  filter would resurface removed items. Centralised in each repository's
  `subscribe`.
- **Denying hard delete is a one-way door** for the app: purging data now requires
  a console/admin action by design.

**Deferred:**
- FCM web-push sender (Cloud Function on `notifications` create) + device-token
  registration wiring (`fcmTokens`).
- A restore / "recently removed" UI over soft-deleted records.
- Cross-device read-state sync and per-member notification preferences.

**Cross-references:**
- ADR-0002 (Firebase backend), ADR-0006 (PWA + push), ADR-0007 (i18n),
  ADR-0012 (docs-currency policy — this change updates the C4 model, data model,
  PWA doc, and the Guide in the same change).
- `docs/design/data-model.md` §6e (notifications) and §6f (soft delete);
  `docs/design/pwa-and-notifications.md` §4.5; `firestore.rules`.

**Supersedes:** nothing. Resolves the "soft-delete vs hard-delete" open question
in the data model. **May be superseded by** a future ADR when the Cloud Function
push sender lands.
