# 0010 — Client-Side Routing via React Router

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Technology

## Context

Flying Fridge is a React SPA (ADR-0001) with multiple top-level views planned: a landing page, an authentication flow (login/register), a family space board with at least five category tabs, and list/calendar views (see `requirements/overview.md`). As a SPA, navigation between these views must be managed client-side. A router must be chosen before the `src/` scaffold is created.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **React Router v6** | De-facto standard; nested routes model maps naturally to the board + category tabs layout; `<Outlet>` + `<Suspense>` enables lazy-loading per route; large ecosystem; well-typed with TypeScript; tested in RTL via `MemoryRouter` | API surface changed significantly at v5→v6; v7's loader-based pattern (Remix lineage) is a further shift — documentation context may be mixed |
| TanStack Router | Fully type-safe routes; file-system routing option | Younger; smaller ecosystem; type-safe routes require code-gen step |
| Wouter | Tiny bundle (~2 kB) | Minimal API — lacks nested routes, data loaders, and code-splitting support needed for the board layout |
| Next.js file-system router | Zero router configuration | Requires Next.js (rejected in ADR-0004 as overkill for an SPA) |
| No router (manual `window.location`) | Zero dependency | Not viable for a multi-view app; loses browser history, deep-linking, and accessibility of `<a>` elements |

## Decision

Use **React Router v6** (`react-router-dom`). Route definitions will be centralised in `src/router.tsx` (or equivalent). The expected top-level route tree:

```
/               → Landing page (ADR-0011)
/login          → Auth flow
/app            → Protected shell (family board)
  /app/tasks    → Tasks board
  /app/notices  → Notices board
  /app/lost     → Lost & Found board
  /app/pantry   → Pantry board
  /app/questions→ Questions board
```

Protected routes (anything under `/app`) will be wrapped in an auth guard component that redirects to `/login` if no Firebase user is present.

## Consequences

**Positive:**
- React Router v6's nested route model fits the board layout directly: the family board shell (`/app`) renders once; only the active category panel swaps via `<Outlet>`.
- Lazy loading (`React.lazy` + `import()`) is straightforward per route — the five board category pages can be split into separate chunks, reducing initial bundle size.
- Deep links work: a family member can share a direct link to the Pantry tab or a specific item.
- `<Link>` and `useNavigate` are accessible by default (they render real `<a>` elements and trigger browser history correctly).

**Negative / costs:**
- React Router's API evolves quickly. v6 diverges from v5 idioms (no `<Switch>`, `<Route exact>`, `<Redirect>`). Future v7 migration (loader/action pattern) will require route-level refactoring.
- The auth guard pattern (redirecting unauthenticated users) must be implemented manually — React Router has no built-in auth concept. If this guard has a bug, unauthenticated users may see protected content for a render cycle before the redirect fires.
- `MemoryRouter` must be used when rendering routed components in Vitest/RTL (ADR-0009) tests; tests that forget to wrap components in a router will fail with a cryptic hook error.

**Deferred:**
- Data loaders (React Router v6.4+ `loader` functions) and the associated `createBrowserRouter` API — deferred; simpler component-level data fetching with Firebase hooks is sufficient for phase 1.
