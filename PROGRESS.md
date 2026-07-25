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
- ✅ Firebase project created; **auth providers enabled**.
- ✅ **Cloud Firestore region: `asia-south1` (Mumbai)** — permanent.
- ✅ **Analytics enabled**; `measurementId` present.
- ✅ `.env.local` populated and verified — all eight `VITE_FIREBASE_*` vars set
  (incl. `VITE_FIREBASE_VAPID_KEY`, so FCM push is wired). File is gitignored;
  values were not printed or committed.

> Follow-up (optional, future): Analytics is on, so `getAnalytics()` can be
> wired in `src/lib/firebase/` when useful — the `measurementId` is already in
> the config object.

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

Firebase human-setup gate is **cleared** — backend features are unblocked.
Ready to build `requirements/requirement-3.md` when you are.
