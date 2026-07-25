# Flying Fridge — Progress Plan

A running log of what's built and what's next, so new requirement files can be
added to `requirements/` and picked up incrementally. Update this file as each
requirement is completed.

## How this project grows

1. A new `requirements/requirement-N.md` describes the next batch of work
   (Functional / Technical / Polishing).
2. Work is implemented, committed to git with a proper message (repo-local
   credentials only — never pushed from here unless asked).
3. This file is updated: move the item to **Done**, note any decisions.

## Status legend
✅ Done · 🚧 In progress · ⬜ Not started

---

## Requirement 1 — Landing page ✅

Source: `requirements/requirement-1.md`

- ✅ Fun, modern landing page as a **single self-contained `index.html`**
  (all CSS/JS inline, zero external network requests, inline-SVG graphics).
- ✅ **Light & dark theme from the system** (`prefers-color-scheme`), plus a
  manual toggle that defaults to the system preference and persists overrides
  in `localStorage`.
- ✅ **Simple, fun animations** — floating fridge magnets, staggered sticky-note
  wiggle, scroll-reveal via `IntersectionObserver`; all gated behind
  `prefers-reduced-motion: reduce`.
- ✅ Standard landing sections: header/nav, hero + CTAs, five feature topics
  (Tasks, Notices, Lost & Found, Pantry, Questions), List & Calendar views,
  how-it-works, closing CTA band, footer.

**Notes / decisions**
- CTAs point to placeholder anchors (`#`) — this file is intended to **become
  the app's index page later**, so no backend routes were invented.
- Design language: warm parchment + tangerine/sage palette, per-category magnet
  colors reused consistently (hero, feature borders, list dots, calendar dots),
  serif display / system-sans body, fridge-with-wings logo motif.

**Deferred to a future requirement**
- Wiring CTAs to real auth / "join a family" flow.
- Turning the static views into the actual app shell.

---

## Requirement 2 — Development environment ✅

Source: `requirements/requirement-2.md`

- ✅ **App scaffolded** — React + TypeScript + Vite, pnpm, react-router. Runs
  with `pnpm dev`; builds with `pnpm build`.
- ✅ **Landing page moved into the app** — ported to `src/pages/landing/` (raw
  markup + original CSS preserved; the inline script re-implemented as a React
  effect). The root `index.html` is now the Vite app shell.
- ✅ **PWA with notification capability** — `vite-plugin-pwa` (Workbox) service
  worker + web manifest; FCM helpers in `src/lib/firebase/messaging.ts`
  (foreground token/permission now; background SW deferred, documented).
- ✅ **Firebase wiring (config-only)** — `src/lib/firebase/` initialises lazily
  from `VITE_FIREBASE_*` env vars; app runs without a project so the landing
  page works before Firebase exists.
- ✅ **i18n** — react-i18next, `en` default, structured for more locales.
- ✅ **Accessibility baseline** — skip link, focus styles, semantic landmarks,
  reduced-motion; `eslint-plugin-jsx-a11y` in lint.
- ✅ **Tests (TDD-ready)** — Vitest + React Testing Library; 9 tests across
  util / i18n / component / routing. `pnpm test:run`.
- ✅ **CI** — GitHub Actions runs install → lint → typecheck → test → build.
- ✅ **Docs & structure** — ADRs (`docs/adr/`), design docs (`docs/design/`,
  architecture as **LikeC4** in `docs/design/architecture/`), and
  `human-instructions/` (Firebase setup guide).
- ✅ **Onboarding README** — living `README.md` so new members (with or without
  an AI assistant) can go from clone to running app.

**Notes / decisions**
- Stack decisions recorded as ADRs (`docs/adr/0001`–`0011`).
- Toolchain pinned for compatibility: **TypeScript 5.9**, **ESLint 9** (latest
  TS 7 / ESLint 10 aren't yet supported by `typescript-eslint` / `jsx-a11y`).
- Vitest uses the **threads** pool + a small `localStorage` polyfill (the forks
  pool failed to spawn workers on this Windows/Node 25 setup).
- Architecture diagrams are **modelled as code with LikeC4** — `pnpm arch` to
  view. See `docs/design/architecture.md`.

**Gate before the next requirement** ✅ (cleared 2026-07-25)
- ✅ Firebase project created; **auth providers enabled: Email/Password + Google**.
- ✅ **Cloud Firestore region: `asia-south1` (Mumbai)** — permanent.
- ✅ **Analytics enabled**; `measurementId` present.
- ✅ `.env.local` populated and verified — all eight `VITE_FIREBASE_*` vars set
  (incl. `VITE_FIREBASE_VAPID_KEY`, so FCM push is wired). File is gitignored;
  values were not printed or committed.

> Follow-up (optional, future): Analytics is on, so `getAnalytics()` can be
> wired in `src/lib/firebase/` when useful — the `measurementId` is already in
> the config object.

---

## Requirement 3 — In-app Guide + docs-currency policy ✅

Source: `requirements/requirement-3.md`

- ✅ **`/guide` route** — a user Guide with a section per module (Tasks, Notices,
  Lost & Found, Pantry, Questions, plus Appearance & accessibility), accessible
  (main landmark, in-page TOC, semantic headings, keyboard/focus) and i18n-wired.
- ✅ **Data-driven** — module registry (`src/features/guide/modules.ts`) as the
  single source of truth; content in i18n under `guide.modules.<id>`.
- ✅ **Guardrail tests** (`src/features/guide/*.contract.test.*`): fail CI if a
  documented module lacks content, if content is orphaned, or if a core module
  is undocumented.
- ✅ **Persistent docs-currency policy** — every change updates docs/ADRs/specs,
  the LikeC4 model, and the Guide in the same change. Recorded in **ADR-0012**,
  `CLAUDE.md`, `README.md`, and saved to Claude's memory.
- ✅ Guide content written to match **requirement-4**'s described behaviors so it
  is accurate as those features land.

**Notes / decisions**
- Design tokens were lifted out of `landing.css` into a global
  `src/styles/theme.css`, and theme control centralized in `src/lib/theme.ts`,
  so **every route** (not just the landing page) is themed and palette/dark
  choices apply everywhere.

---

## Requirement 4 — Feature modules 🚧 (Tasks vertical slice, in progress)

Source: `requirements/requirement-4.md`. Approach: **Tasks vertical slice first**
(minimal auth + one family), then generalize. Defaults: **dnd-kit** for
drag-and-drop, **Firebase Analytics** (via `measurementId`) for telemetry.

- ✅ **Tasks domain + data layer** — `src/features/tasks/`: `Task` type; pure
  `taskLogic` (target-date urgency buckets for colour coding, self-assign
  helpers, my-tasks/board partition); a `TaskRepository` interface with an
  **in-memory** implementation (tests/offline) and a **Firestore** one
  (real-time, family-scoped, timelined). 11 unit tests (TDD).
- ✅ **Auth** — `src/features/auth/`: Firebase Email/Password + Google via
  `lib/firebase/auth`; `AuthProvider`/`useAuth`; accessible `SignInPage`
  (labels, error alert, keyboard); `/app` route gated (`RequireAuth`). Runs as
  "signed out" without Firebase config so the landing/guide still work.
- ✅ **Family + Tasks dashboard** — minimal family context (`src/features/family/`,
  join by shared name/code); `/app` shows setup then the board. Add task,
  self-assign with a **My tasks** section, **target-date colour coding**, mark
  done, remove — all wired to the repository (Firestore when configured) via a
  `useTasks` hook, with **Firebase Analytics** telemetry events (`task_add`,
  `task_assign`, `task_complete`). Accessible + i18n. Integration tests for the
  add→assign→done flow and the family gate.
- ⬜ **Next:** simple **drag-and-drop** (dnd-kit) for claim/reorder; then the
  other modules — Notices, Lost & Found, Pantry, Questions — repeating the
  domain → repository → UI pattern.

> ⚠️ **Manual step required now:** Firestore was created in production mode, so
> writes fail with "Missing or insufficient permissions" until rules are
> published. Rules live in `firestore.rules`; publish via
> `human-instructions/02-firestore-security-rules.md`. Current rules allow any
> signed-in user to read/write `tasks` (not yet family-scoped — see the note
> above).

Boundary note: `lib/firebase` owns SDK init + Auth/Messaging/Analytics wrappers;
feature repositories may call Firestore data APIs directly behind the repository
interface (docs reconciled in CLAUDE.md, architecture.md, folder-structure.md).

Data model for Tasks recorded in `docs/design/data-model.md` §6a; keep C4 +
Guide updated as the UI lands.

---

## Backlog / candidate features (from requirement-1 "Polishing")

Not scheduled — raised for consideration when writing future requirement files:

- **Auth & family spaces** — sign up, log in, create/join a family via invite code.
- **The five boards themselves** — CRUD for Tasks, Notices, Lost & Found,
  Pantry, Questions, each pinned as a "magnet" on the board.
- **List & Calendar views** — real, filterable/sortable views over the items.
- **Reminders & notifications** — due-date nudges, "pantry low" alerts.
- **Assignments & @mentions** — assign a task to a family member.
- **Recurring items** — weekly chores, standing shopping-list staples.
- **Pantry smarts** — quantity tracking, low-stock auto-flag, quick "add to list".
- **PWA / offline** — installable, works offline, syncs when back online.
- **Real-time sync** — changes appear live across family members' devices.
- **Media on notes** — attach a photo (e.g. of the lost item, or a receipt).
- **Search & tags** across everything on the board.
- **Themes & personalization** — custom magnet colors, family avatar/name.
- **Localization** — multi-language support.

---

## Next up ⬜

Requirement 3 is **done**. Requirement 4 (feature modules) is next — a large
build to be done one module at a time, starting with the auth/data foundation
then Tasks. Sequence to be confirmed before starting.
