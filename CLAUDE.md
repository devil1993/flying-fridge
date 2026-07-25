# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Flying Fridge** is a digital noticeboard for families — a modern, online take on the classic fridge-and-magnets way of sharing household information (hence "flying"). Users log in and join a family, then share **tasks, info/notices, lost & found, pantry, and questions**, with both **list and calendar views**. The goal is to capture the everyday family topics that are easily forgotten.

## How this project grows

Work is **requirement-driven**. Each `requirements/requirement-N.md` (Functional / Technical / Polishing) is the next unit of work. Read `requirements/overview.md` first. After finishing a requirement, update `PROGRESS.md`. `README.md` is the living onboarding doc — keep it accurate when structure/commands change.

## Stack & layout

Frontend-only **React SPA (TypeScript, Vite, pnpm)** backed by **Firebase** (Auth + Firestore + Cloud Messaging), a **mobile-first PWA** with push. Not yet provisioned — Firebase config is a manual human step (`human-instructions/`), read lazily from `VITE_FIREBASE_*` env vars, so the app runs without it.

- `src/pages/` — route screens. `src/pages/landing/` is the Requirement-1 landing page, preserved as raw markup + CSS with its script re-implemented as a React effect (see `docs/adr/0011`).
- `src/lib/firebase/` — the **only** place the Firebase SDK is imported.
- `src/features/*` (grows later), `src/components/`, `src/i18n/`, `src/styles/`, `src/test/`.
- `docs/adr/` — Architecture Decision Records. `docs/design/` — design docs; **architecture is modelled as code with LikeC4** in `docs/design/architecture/*.c4` (`pnpm arch`).
- `human-instructions/` — manual out-of-workspace steps. `requirements/`, `PROGRESS.md`, `README.md`.

## Commands

- `pnpm dev` · `pnpm build` · `pnpm preview`
- `pnpm lint` · `pnpm typecheck` · `pnpm test:run` (CI runs these four + build)
- `pnpm arch` (LikeC4 viewer) · `pnpm arch:check` (validate model)
- Single test: `pnpm exec vitest run src/path/to.test.tsx`

## Conventions & gotchas

- **All user-facing strings via i18n keys** (`src/i18n/locales/`). Keep the **accessibility baseline**: keyboard-first, semantic landmarks, visible focus, reduced-motion (WCAG 2.1 AA). Tests are set up for TDD (Vitest + RTL).
- Toolchain is pinned: **TypeScript 5.9**, **ESLint 9** (TS 7 / ESLint 10 aren't yet supported by `typescript-eslint` / `eslint-plugin-jsx-a11y`) — don't blindly bump these.
- Vitest uses the **threads** pool + a `localStorage` polyfill in `src/test/setup.ts` (the default forks pool fails to spawn workers on this Windows/Node 25 setup).

## Git workflow (required)

- Commit with proper, scoped messages (Conventional Commits). **Repo-local git identity only** — never use or modify system-wide credentials. Nothing is pushed from here unless asked.

## Environment notes

- Windows; primary shell is PowerShell, with a Bash (POSIX) tool also available. Watch path quoting — the repo path contains spaces (`Learning and POC`).
