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
- ✅ **App shell + Notices module** — **Notices** (`src/features/notices/`): post
  a notice, optional **date**, mark **important** (colour highlight) and
  **permanent**, 1-month expiry for non-permanent (`noticeLogic`), take down
  (kept/timelined). Domain + repository (Firestore + in-memory) + UI + telemetry
  + tests.
- ✅ **Unified navbar + Dashboard** — merged the double header: the module tabs
  (**Dashboard · Tasks · Notices**) + **switch family** now live in the single
  top **TopBar** (context-aware); the app body just renders the active module.
  Added a **Dashboard** overview (counts across modules) and per-module keyboard
  **shortcuts** (d/t/n, shown on hover) alongside the existing h/g/a.
- ✅ Fixed Firestore items not appearing immediately (estimated server
  timestamps).
- ✅ **Lost & Found, Pantry, Questions modules** — all five board modules are now
  built (domain + repository + UI + telemetry + tests), each on the tab nav with
  its own keyboard shortcut (l/p/q) and summarised on the Dashboard.
  `firestore.rules` already covers their collections.
  - **Lost & Found:** post a search; posting date shown; mark found / take down.
  - **Pantry:** made-date, shelf life → freshness, quantity +/- , mark consumed.
  - **Questions:** ask, answer (array), close.
- ⬜ **Optional remaining:** **drag-and-drop** (dnd-kit) where useful.
- ⏸️ **Deferred (owner will configure on the Firebase console):** real
  Firestore-backed **family membership** + per-family **security rules** +
  add-member modal. Family is a client-side code until then.

> ⚠️ **Manual step (re-publish rules):** `firestore.rules` now covers all five
> board collections (`tasks`, `notices`, `lostAndFound`, `pantry`, `questions`)
> — signed-in users may read/write them (not yet family-scoped). Re-publish via
> `human-instructions/02-firestore-security-rules.md` so Notices (and the coming
> modules) work.

Boundary note: `lib/firebase` owns SDK init + Auth/Messaging/Analytics wrappers;
feature repositories may call Firestore data APIs directly behind the repository
interface (docs reconciled in CLAUDE.md, architecture.md, folder-structure.md).

Data model for Tasks recorded in `docs/design/data-model.md` §6a; keep C4 +
Guide updated as the UI lands.

---

## Requirement 5 — Family backend, telemetry, settings/i18n, notifications 🚧

Source: `requirements/requirement-5.md`. Four parts, built as increments.

- ✅ **Family as a backend entity** — `families/{familyId}` doc with `memberUids`
  + `members`; `FamilyProvider` resolves the signed-in user's family from
  Firestore (`array-contains` on uid); **Security Rules scope every board
  collection by family membership** (`isMemberOf` via `get()`); a "you're not in
  a family yet" screen shows the user's UID to share. Families are
  **bootstrapped in the console** — `human-instructions/03-bootstrap-family.md`.
  (Offline/tests fall back to a demo family.)
- ✅ **Telemetry across all features** — Firebase Analytics events: existing
  per-action events (e.g. `task_add`), plus `feature_view` (usage count per
  module) and `feature_engagement` (seconds + click count per feature, flushed
  on module switch / unmount) via `useFeatureTelemetry` in the app shell.
- ✅ **Settings page + i18n switch** — a **Settings** module (tab, shortcut `s`):
  appearance (palette + light/dark), **language** switch, family + members,
  account + sign out. **Bengali (`bn`)** added and wired into i18n
  (`supportedLngs`), core UI translated; the long-form Guide falls back to `en`
  for now. Language choice persists (LanguageDetector) and logs a
  `language_change` event.
- ✅ **Notifications (in-app, real-time)** — a family-scoped, append-only
  `notifications` collection (`src/features/notifications/`, same repository
  pattern). Each board publishes on add (`notifyItemAdded`); every member
  subscribes (`useNotifications`) and sees a **bell + live unread badge** in the
  top bar (`NotificationBell`) that **stays visible on the bar even on mobile**
  (never collapses into the hamburger). Only the language-neutral **excerpt** is
  stored; the sentence is localised per viewer (en/bn). **Read state is per-user
  & local** (`lastSeen` in `localStorage`). When the tab is unfocused and OS
  permission is granted, a one-off `Notification` toast is raised. **ADR-0013.**
  - ⏸️ **Background (app fully closed)** needs FCM web push + a **Cloud Function
    on `notifications` create** (Blaze). Deferred but purely additive — the feed
    already writes the docs. See `docs/design/pwa-and-notifications.md` §4.5.
- ✅ **Soft delete everywhere** — the app never destroys data: delete/remove sets
  a `deleted` marker (tasks/notices) or a terminal status; reads filter it out;
  **Security Rules deny hard `delete`** on all board collections. **ADR-0013.**
- ✅ **Task auto-assign on complete** — whoever marks a task done is set as its
  assignee (reopening leaves it be). **ADR-0013.**

**Notes / decisions**
- Guide gained a **Notifications** section (registry + en/bn-aware content +
  icon); C4 model gained a `features/notifications` component; data model gained
  §6e (notifications) + §6f (soft delete). Docs-currency policy (ADR-0012) met.
- Bengali shifted to **Kolkata / West-Bengal Hindu dialect** (জল, ভাঁড়ার, টাটকা…).

> ⚠️ **Manual steps (Firebase console):** (1) **re-publish `firestore.rules`** —
> now adds the `notifications` collection AND denies hard `delete` on every board
> collection (soft-delete is enforced server-side); (2) bootstrap a family
> document per `human-instructions/03` with a **`memberUids`** array. Until both
> are done, a signed-in user sees "not in a family yet".

---

## Requirement 6 — Informed dashboard ✅

Source: `requirements/requirement-6.md`. A split view below the module overview.

- ✅ **Cross-module agenda** — `src/features/dashboard/` aggregates all five
  boards client-side (no new collection) into one list via pure, tested
  `agenda.ts`. Each type contributes one relevant date (task `targetDate`,
  notice `date`, pantry expiry = `madeOn + keepsDays`; Lost & Found + Questions
  undated). **ADR-0015.**
- ✅ **Tap-switchable split** (`AgendaSplit`, WAI-ARIA tabs): **Recent** +
  **Calendar**.
- ✅ **Recent** — **Overdue** items first (priority; all items before the focus
  date), then **Coming up** (focus … +2 days, forward-only per UAT), then
  **undated** at the bottom. Colour-coded by type; each row opens its module.
- ✅ **Calendar** — current month grid with a colour-coded dot per type on each
  day; tapping a day opens Recent focused on that date; **Back to today** when
  off-today. Weekday/month names localised via `Intl` (en/bn).
- ✅ Docs currency: Guide gains a Dashboard section (registry + icon + content);
  C4 gains a `features/dashboard` component; data-model §6g; ADR-0015. 16 new
  tests.

---

## UAT follow-ups ✅

Small fixes from user acceptance testing:

- ✅ **Form drafts persist across navigation** — `useDraft` (localStorage) on
  every add-form; drafts restore on remount, clear on submit. (Switching modules
  unmounts the board, so a route-per-feature wouldn't help — the data itself is
  persisted.)
- ✅ **Recently closed + restore** on all boards — a completed/taken-down/
  consumed/closed item shows in a "Recently closed" list with a **Restore**
  action (repository `restore()` puts the status back). Tasks already reopen.
- ✅ **Dark-mode readability** — pinned `<select>` option colours (theme palette
  + settings language) to theme tokens.
- ✅ **Notifications** — badge clears reliably on view (mark-read effect while the
  panel is open) and the feed is capped at 10.
- ✅ **Signed-in users skip the welcome screen** — the root route (`Home`)
  redirects authenticated users to `/app` with `replace`, so `/` is never left
  in history; pressing Back can't return to the welcome page (any back-nav to
  `/` bounces straight to `/app`).
- ✅ **Mobile bottom navigation** — icon-only bottom bar (`BottomNav`) for the six
  content boards on screens <720px; Settings + Guide remain in the top hamburger
  as overflow; desktop keeps inline top tabs. Reuses the Guide icon set.
  **ADR-0016.**

---

## Deployment — GitHub Pages ✅

- ✅ **`deploy-pages.yml`** builds and publishes to **GitHub Pages** on push to
  `main` (official `configure-pages`/`upload-pages-artifact`/`deploy-pages`).
  Base path derived from the repo name (`VITE_BASE`), router `basename` from
  `BASE_URL`, `404.html` SPA fallback, base-relative PWA manifest, and landing
  `/app`·`/guide` links base-prefixed at render. Firebase web config passed from
  repo Secrets (absent → signed-out/demo). **ADR-0014.**
- 🔧 **Manual one-time steps** (owner): push to `main`, enable Pages (Source:
  GitHub Actions), optionally add `VITE_FIREBASE_*` secrets + authorize the
  `*.github.io` domain — see `human-instructions/04-github-pages.md`.

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
