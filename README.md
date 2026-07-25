# Flying Fridge 🧲

A **digital noticeboard for families** — a modern take on the fridge door
covered in magnets and sticky notes. Log in, join your family, and share the
everyday things that are easy to forget:

- **Tasks** · **Notices / Info** · **Lost & Found** · **Pantry** · **Questions**

…across **List** and **Calendar** views. Adding anything to a board sends a
**real-time in-app notification** to the rest of the family (bell + unread badge),
and nothing is ever hard-deleted — the app **soft-deletes** so the family history
stays intact. It's called *Flying* Fridge because the fridge door goes digital
and travels with you.

> **Project status:** early development. The **landing page** (Requirement 1) and
> the **development-environment bootstrap** (Requirement 2 — React + Firebase PWA
> scaffold) are done. See [`PROGRESS.md`](./PROGRESS.md) for the live plan and
> [`requirements/`](./requirements/) for the source-of-truth specs.

---

## Tech stack

Frontend-only **React SPA** backed by **Firebase**, shipped as a **mobile-first
PWA** with push notifications.

| Area | Choice |
| --- | --- |
| Language | TypeScript |
| Build / dev server | Vite |
| Package manager | pnpm |
| Routing | react-router |
| i18n | react-i18next (`en` default) |
| PWA / offline | `vite-plugin-pwa` (Workbox) |
| Push | Firebase Cloud Messaging |
| Backend | Firebase Auth + Cloud Firestore + FCM |
| Tests | Vitest + React Testing Library |

Every choice is recorded with rationale in [`docs/adr/`](./docs/adr/). The
architecture (C4 model) and designs live in [`docs/design/`](./docs/design/).

---

## Prerequisites

- **Node.js ≥ 20** (CI runs on 20; newer works locally)
- **pnpm ≥ 9** — `npm install -g pnpm` if you don't have it

---

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. (Optional now, required for backend features) create your local env file
cp .env.example .env.local
#    then fill in the VITE_FIREBASE_* values — see the Firebase setup guide below.
#    The app runs WITHOUT this; the landing page needs no backend.

# 3. Start the dev server
pnpm dev
```

Then open the URL Vite prints (default http://localhost:5173).

### Firebase setup

Firebase is **not provisioned in the repo** — each developer/owner creates a
project and supplies config locally. Follow the step-by-step guide:

➡️ [`human-instructions/01-firebase-project-setup.md`](./human-instructions/01-firebase-project-setup.md)

Your filled-in values go in `.env.local` (gitignored — never commit it).

---

## Available scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Typecheck (`tsc -b`) then build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | ESLint (incl. `jsx-a11y` accessibility rules) |
| `pnpm typecheck` | TypeScript project build / type check |
| `pnpm test` | Vitest in watch mode |
| `pnpm test:run` | Vitest once (what CI runs) |
| `pnpm test:coverage` | Vitest with a coverage report |

CI (`.github/workflows/ci.yml`) runs **install → lint → typecheck → test →
build** on every push to `main` and every PR. Run those five locally before
pushing and you'll match CI.

---

## Project structure

```
flying-fridge/
├─ index.html                 # Vite entry (app shell)
├─ src/
│  ├─ main.tsx                # bootstraps React, router, i18n, service worker
│  ├─ App.tsx                 # routes + skip link
│  ├─ pages/                  # route screens (landing/ = ported Req-1 page)
│  ├─ components/             # shared UI + a11y primitives (e.g. SkipLink)
│  ├─ features/               # (grows later) one folder per domain area
│  ├─ lib/firebase/           # the ONLY place the Firebase SDK is imported
│  ├─ i18n/                   # react-i18next config + locales/
│  ├─ styles/                 # global.css (base) — pages bring their own CSS
│  └─ test/                   # Vitest setup
├─ public/                    # static assets (favicon, robots.txt)
├─ docs/
│  ├─ design/                 # architecture (C4) + design docs
│  └─ adr/                    # Architecture Decision Records
├─ human-instructions/        # manual steps done OUTSIDE the workspace (Firebase…)
├─ requirements/              # the numbered specs that drive development
├─ .github/workflows/         # CI
├─ PROGRESS.md                # living plan / status
└─ CLAUDE.md                  # guidance for AI coding assistants
```

---

## Documentation map

| If you want to… | Read |
| --- | --- |
| Understand the system shape (C4: context→container→component) | [`docs/design/architecture.md`](./docs/design/architecture.md) |
| Understand the in-app Guide (`/guide`) and its guardrails | [`docs/design/guide.md`](./docs/design/guide.md) |
| See folder conventions, data model, PWA/notifications, i18n/a11y | [`docs/design/`](./docs/design/) |
| Know *why* a technology was chosen | [`docs/adr/`](./docs/adr/) |
| Set up Firebase / other manual steps | [`human-instructions/`](./human-instructions/) |
| See what's built and what's next | [`PROGRESS.md`](./PROGRESS.md) |
| See the original feature specs | [`requirements/`](./requirements/) |

---

## Development workflow

This project is built to move forward **with or without** an AI assistant.

### With an AI assistant (Claude Code or other LLMs)

- [`CLAUDE.md`](./CLAUDE.md) orients the assistant to the repo and its rules.
- Work is **requirement-driven**: a new `requirements/requirement-N.md` describes
  the next batch; the assistant implements it and updates `PROGRESS.md`.
- ADRs and design docs give the assistant (and you) shared, durable context so
  decisions aren't re-litigated each session.

### Without an assistant (plain human)

Nothing here depends on an LLM. It's a standard Vite + React + TypeScript app:

1. `pnpm install`, then `pnpm dev`.
2. Pick up the next item in [`PROGRESS.md`](./PROGRESS.md) (or a new
   `requirements/` file).
3. Write code and tests; keep `pnpm lint typecheck test:run build` green.
4. Commit with a clear message (see below) and open a PR — CI gates it.

### Testing & TDD

The suite is set up so features can be built test-first. Put unit tests next to
the code (`*.test.ts[x]`); component tests use React Testing Library. See
`src/lib/utils/cx.test.ts` and `src/pages/landing/LandingPage.test.tsx` for the
two patterns.

### Accessibility & i18n baselines

- **Keyboard-first, WCAG 2.1 AA** is the standing bar (a skip link, visible
  focus, semantic landmarks, reduced-motion). `jsx-a11y` lint rules enforce part
  of this. Details: [`docs/design/i18n-and-accessibility.md`](./docs/design/i18n-and-accessibility.md).
- **All user-facing strings go through i18n keys** (`src/i18n/locales/`).

---

## Git & commits

- **Repo-local git identity** — this repo uses its own committer config; it does
  not touch your global git config. Nothing is pushed to a remote from the
  workspace (commits only) unless you set that up yourself.
- Prefer small, scoped commits with clear messages (Conventional Commits style,
  e.g. `feat(landing): …`, `chore: …`, `docs: …`).

---

## Documentation currency (project rule)

From requirement-3 onward, **every functional change keeps the docs current in
the same change**: `docs/design/*`, ADRs, the LikeC4 model, and the in-app
**Guide** (`src/features/guide/`). The Guide is guardrailed — contract tests
(`src/features/guide/*.contract.test.*`) fail CI if a documented module lacks
content, if content is orphaned, or if a core module is undocumented. See
[ADR-0012](./docs/adr/0012-in-app-guide-and-docs-currency-policy.md).

## Keeping this README current

This file is a **living onboarding doc** — when you change how the project is
run, structured, or set up, update the relevant section here (and `PROGRESS.md`)
in the same change. A new member should always be able to go from clone to
running app using only this page and the linked guides.
