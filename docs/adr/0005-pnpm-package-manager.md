# 0005 — pnpm as the Package Manager

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Technology

## Context

The project needs a JavaScript package manager for dependency installation, running scripts, and CI. The choice affects disk usage, install speed, phantom-dependency safety, and the commands baked into CI pipelines and developer documentation. Once scripts and CI are standardised on a manager it is disruptive to switch, so the choice is made early and recorded.

`requirements/requirement-2.md` asks for a build pipeline in GitHub Actions. The CI scripts and any `package.json` scripts will be written to use one manager consistently.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **pnpm** | Content-addressable store saves disk space; hard-links prevent duplicate packages; strict by default (no phantom dependencies); fast installs; workspace support for monorepo growth; `pnpm` is a single binary, easy to pin in CI with `corepack` | Slightly less ubiquitous than npm — contributors must install pnpm; rare packages with bad `peerDependencies` may require `--shamefully-hoist` |
| npm | Ships with Node.js; no extra install | Slow installs; flat `node_modules` allows phantom dependencies; lockfile churn |
| yarn (classic v1) | Widely known; workspaces | Effectively superseded; security issues in older versions |
| yarn (berry v4) | Plug'n'Play removes `node_modules` entirely | PnP breaks some tooling (Vite, Vitest) without configuration; significant DX friction |

## Decision

Use **pnpm** throughout. CI workflows invoke `pnpm install`, `pnpm build`, `pnpm test`, etc. The `pnpm-lock.yaml` lockfile is committed. Developers are expected to have pnpm available (installable via `corepack enable && corepack prepare pnpm@latest --activate` or directly from `pnpm.io`).

## Consequences

**Positive:**
- The `node_modules` structure is strict: a package can only import what it declares in its own `dependencies`. This prevents whole classes of "works on my machine" phantom-dependency bugs.
- Disk usage on developer machines and CI runners is significantly lower than npm because packages are hard-linked from a shared global store.
- pnpm workspaces are available if the project later grows into a monorepo (e.g. a separate Cloud Functions package alongside the frontend).

**Negative / costs:**
- Any new contributor must install pnpm before working on the project. This is a small but real onboarding friction compared to npm.
- If a dependency is misconfigured regarding peer dependencies, pnpm's strictness will surface the error where npm would silently hoist and hide it. This is actually desirable but can cause initial "why doesn't this work?" confusion.
- All CI documentation, `CLAUDE.md`, and script examples must consistently use `pnpm` commands — mixing `npm run` and `pnpm run` in documentation causes confusion.
