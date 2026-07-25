# 0014 — Deploy to GitHub Pages via GitHub Actions

- **Status:** Accepted
- **Date:** 2026-07-26
- **Type:** Process / Infrastructure

## Context

Flying Fridge is a frontend-only static bundle (ADR-0001) — `vite build`
produces plain HTML/JS/CSS with no server. It needs a public, HTTPS home so the
app can be tried on a phone (install/PWA and Firebase both require HTTPS). The
repo already lives on GitHub with an Actions CI pipeline (ADR-0009), and there's
no separate hosting account or budget. Two frontend wrinkles must be handled for
any static host under a sub-path: the asset **base path** and **SPA deep-link
routing**.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **GitHub Pages via Actions (chosen)** | Free; already on GitHub; first-class `actions/deploy-pages`; zero new accounts | Project site served under `/<repo>/` (base-path handling needed); no server-side SPA rewrite (needs a `404.html` fallback) |
| Firebase Hosting | Same vendor as our backend (ADR-0002); clean SPA rewrites; served at `/` | Another deploy target + token to manage; overkill while Pages suffices; ties hosting to Blaze considerations later |
| Netlify / Vercel | Great DX, SPA-aware | A third-party account/integration for no gain over Pages here |

## Decision

Publish on **GitHub Pages** with a dedicated workflow
(`.github/workflows/deploy-pages.yml`) that builds and deploys on every push to
`main` (plus manual `workflow_dispatch`), using the official
`configure-pages` → `upload-pages-artifact` → `deploy-pages` actions with the
standard `pages`/`id-token` permissions and a `pages` concurrency group.

Adaptations that make a sub-path static deploy work — all no-ops at the default
base, so local dev/preview is unchanged:

1. **Base path** — Vite `base` reads `process.env.VITE_BASE` (default `/`); the
   workflow sets `VITE_BASE=/<repo>/` derived from `github.event.repository.name`
   (no hard-coded repo name).
2. **Router** — `BrowserRouter basename` is `import.meta.env.BASE_URL` (trailing
   slash trimmed).
3. **SPA fallback** — the workflow copies `dist/index.html` to `dist/404.html`
   so Pages serves the app for unknown deep links (assets are base-absolute, so
   they still resolve).
4. **PWA manifest** — `start_url`/`scope` are base-relative (`.`).
5. **Landing markup** — the verbatim requirement-1 HTML (ADR-0011) has its
   root-absolute `/app` and `/guide` links prefixed with `BASE_URL` at the render
   boundary, leaving the source artifact untouched.
6. **Firebase config** — passed to the build from repo **Secrets** (public web
   config); absent secrets simply yield signed-out/demo mode.

Enabling Pages (Source: GitHub Actions), pushing to `main`, adding secrets, and
authorizing the `*.github.io` domain are manual one-time steps documented in
`human-instructions/04-github-pages.md`.

## Consequences

**Positive:** free HTTPS hosting with zero new infrastructure; deploy is
automatic on merge to `main`; the base/routing handling is env-driven, so forks
and a future custom domain (set `VITE_BASE=/`) work without code edits.

**Negative / costs:** project site lives under `/<repo>/`, an extra concept to
remember; SPA routing relies on a `404.html` trick rather than real rewrites (the
initial deep-link load returns HTTP 404 before the SPA boots — invisible to users
but worth knowing); the repo must be public for free Pages.

**Deferred:** custom domain; deploying only after CI passes (currently the deploy
job doesn't gate on `ci.yml`); preview deploys for PRs.

**Cross-references:** ADR-0001 (static frontend), ADR-0009 (CI), ADR-0011
(verbatim landing markup), ADR-0006 (PWA — HTTPS requirement);
`human-instructions/04-github-pages.md`.
