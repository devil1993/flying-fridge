# 0018 — Editable Board Entries (In-Place Correction of Author Content)

- **Status:** Accepted
- **Date:** 2026-08-21
- **Type:** Architecture / Data model

## Context

All five board modules (tasks, notices, lost & found, pantry, questions) were
**create/delete only**. A typo in a task description, a wrong date on a notice,
or a misspelled pantry item could only be corrected by deleting and re-adding.
That workaround has two concrete costs:

1. **It pierces ADR-0013's timeline guarantee.** Soft-delete preserves the old
   record but the corrected entry starts a fresh timeline, losing the original
   `createdAt` and any completion/status history.
2. **It fires a re-notification.** ADR-0013's add action appends to the
   `notifications` feed; the family gets pinged for the same item twice, once
   for the deletion (no notification) and once for the fresh add.

The stack imposes no new constraints here. Flying Fridge is frontend-only on
Firebase (ADR-0001/0002) and every module already follows the **repository
pattern** (interface + Firestore impl + in-memory impl + hook + board/card UI).
Firestore Security Rules already contain `allow update: if isMemberOf(...)` on
all five board collections — that gate was introduced in ADR-0013 so that
soft-delete could write its `deleted` marker. Content edits travel through the
same rule and **require no rules change**.

## Options Considered

### Edit UX

| Option | Assessment |
|--------|------------|
| **A — Inline Edit → Save / Cancel on each card (chosen)** | Matches the existing in-card action pattern (complete, remove, etc.); mobile-first; no new UI primitive; keyboard-accessible. Trade-off: the form lives in an already-dense card and must be carefully scoped to content fields only. |
| B — Modal dialog | Cleaner visual isolation, but the app uses no modal dialogs elsewhere and introducing one is a heavier pattern than the problem warrants. Rejected. |
| C — Delete + re-add only (status quo) | Loses timeline, re-notifies the family, violates ADR-0013 intent. Rejected. |

### Field scope

| Option | Assessment |
|--------|------------|
| **Content fields only (chosen)** | Tasks: `description` + `targetDate`. Notices: `text` + `date`. Lost & found: `description`. Pantry: `name` + `madeOn` + `keepsDays`. Questions: `text`. System fields (`status`, `assignee`, `deleted`, `createdBy`, `createdAt`, answers) keep their own dedicated controls. Pantry quantity keeps its +/- stepper and is excluded from the edit form. |
| All fields including system fields | Allowing edits to `createdBy`, `assignee`, or answers blurs the audit trail and duplicates purpose with existing controls. Rejected. |

### Persistence

| Option | Assessment |
|--------|------------|
| **`update(id, changes)` on the repository interface (chosen)** | Firestore `updateDoc` writes only the changed content fields + `updatedAt`. In-memory impl patches the record in place. Purely additive: no new collection, no schema migration. |
| New `edits` sub-collection per item | Full field-level history. Out of scope for the current family-board trust model; deferred explicitly below. |

## Decision

### Repository layer

Add an `Edit<Module>Input` type per module (e.g. `EditTaskInput`,
`EditNoticeInput`) and a corresponding `update(id, changes)` method to all five
repository interfaces. Both implementations receive the method:

- **Firestore impl** — `updateDoc` writes the content fields plus `updatedAt:
  serverTimestamp()`.
- **In-memory impl** — patches the record in the array in place, same field set.

`createdBy` and `createdAt` are never touched by `update`. Edits do not append
to the `notifications` feed (a correction is not an event the family needs to
be alerted about).

### Hook layer

Each board hook exposes an `edit<Module>` action (e.g. `editTask`, `editNotice`,
`editPantryItem`) that calls the repository `update` and emits a scoped
telemetry event (`task_edit`, `notice_edit`, `lost_edit`, `pantry_edit`,
`question_edit`).

### UI layer

- **Tasks, notices, questions** — an Edit button on each card toggles an inline
  form (pre-populated with current values). Save and Cancel sit inline. Save is
  disabled while the required text field is empty.
- **Pantry, lost & found** — the list is rendered in the board component, so
  edit state (`editingId`) lives at board level and the form renders inline in
  the list row.
- No `autoFocus` on form inputs (accessibility rule; the Save button is the
  primary action and is reachable by Tab).
- All strings through i18n (ADR-0007) under `<module>.edit.*` keys, both `en`
  and `bn` locales.

### Demo mode

Demo mode (ADR-0017) inherits edit capability for free: it already switches the
Firestore repositories for in-memory ones, and `update` is now present on all
in-memory impls.

### Docs currency

Per ADR-0012 policy, the same change updates the LikeC4 architecture model
(`docs/design/architecture/*.c4`), `docs/design/data-model.md` §6f-2, and the
in-app Guide (`src/features/guide/`) with edit steps for each module. Guide
guardrail tests must continue to pass.

## Consequences

**Positive:**
- Mistakes are fixable in place; the original timeline and `createdAt` are
  preserved.
- No re-notification to the family for a content correction.
- Purely additive change: no Firestore rules change, no new collection, no
  schema migration.
- Demo mode gets edit capability without any additional work.
- Docs-currency policy (ADR-0012) is observed: guide, C4 model, and data-model
  doc updated in the same change.

**Negative / costs:**
- **No per-field edit history.** Only `updatedAt` moves; there is no record of
  what changed or what the previous value was. A full diff/history view is out
  of scope.
- **Any family member can edit any item.** This is consistent with the existing
  shared-board trust model and the `allow update: if isMemberOf(...)` rule —
  edit is not restricted to the original author. A family that wants per-author
  restrictions would need a separate rule and UI.
- **Last write wins.** There is no optimistic-concurrency guard. For a small
  family board with low concurrent-write probability this is acceptable; a
  conflict strategy is not warranted yet.

**Deferred:**
- Edit history / diff view per item.
- Per-author edit restrictions (restrict `update` in rules to `createdBy ==
  request.auth.uid` only if ever wanted).
- Editing answers within a question (answers have their own data path and
  interaction model).

**Cross-references:**
- ADR-0013 — soft delete + notifications feed; the exact reason delete + re-add
  is an inadequate substitute.
- ADR-0012 — docs-currency policy; this change updates the LikeC4 model,
  `data-model.md` §6f-2, and the in-app Guide in the same commit.
- ADR-0007 — i18n; all edit strings go through `en` / `bn` locale files.
- `firestore.rules` is unchanged; `allow update: if isMemberOf(...)` already
  covers content edits.
