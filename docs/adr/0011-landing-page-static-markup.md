# 0011 — Landing Page Ported as Static Markup (Not Converted to JSX)

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Implementation

## Context

Requirement 1 produced a fully designed, manually verified single-file landing page (`index.html` at the repo root). It contains inline CSS (hundreds of lines of custom properties, animations, responsive breakpoints, light/dark theming) and inline JavaScript (scroll-reveal via `IntersectionObserver`, theme toggle persisting to `localStorage`, floating magnet animations). The design is considered correct and complete.

Requirement 2 (`requirements/requirement-2.md`) says: "Move the landing page into the app so that we can run it." The question is *how* to move it — convert it to JSX/components, or port it as-is.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Import raw HTML + CSS, use a React effect for the JS behaviour** | Zero regression risk — the exact verified markup and styles are preserved; fast to implement; no chance of subtle visual differences introduced by JSX conversion | The landing page is not a proper React component; strings are not i18n-wired (see ADR-0007); it cannot use React state or routing hooks directly; it is a dead end for the long-term component architecture |
| Full JSX conversion in one pass | Clean React component; i18n-ready; proper React event handling | High risk of subtle visual regressions (CSS specificity, animation timing, dark-mode edge cases); significant effort with no user-visible benefit during this requirement cycle; delays the Requirement 2 deliverables |
| Incremental JSX conversion (section by section) | Gradual, safer | Still takes meaningful time; risk is spread across multiple PRs; tooling is not yet fully set up when this decision is made |

## Decision

Port the landing page into the React app by **importing the raw HTML as a string and injecting it via `dangerouslySetInnerHTML`**, with a small React `useEffect` that re-runs the theme toggle and scroll-reveal JavaScript that was previously inline in `index.html`. The CSS is imported as a separate file.

Specifically:
- The landing page's HTML body content is imported into a `LandingPage` React component.
- The component is mounted at the `/` route (see ADR-0010).
- A `useEffect` re-attaches the `IntersectionObserver` for scroll-reveal and initialises the theme toggle from `localStorage`, mirroring the behaviour of the original inline script.

## Consequences

**Positive:**
- The verified, polished landing page is live in the app immediately with no visual regression risk.
- Implementation time is hours, not days — the Requirement 2 scope (dev environment setup, routing, i18n scaffold, PWA bootstrap) is not delayed by a full JSX rewrite.

**Negative / costs:**
- **Not i18n-wired.** All strings in the landing page HTML are hard-coded English and bypass the `t()` pipeline established in ADR-0007. This is a known and accepted technical debt item.
- **Not accessible via the a11y lint.** `eslint-plugin-jsx-a11y` (ADR-0008) cannot analyse HTML inside a `dangerouslySetInnerHTML` string. The landing page's accessibility must be manually verified when it is eventually migrated.
- **`dangerouslySetInnerHTML` carries an XSS risk** if the source of the HTML ever becomes dynamic or user-influenced. It is safe here only because the HTML is a static import from the local repository — this must not be changed to accept any runtime input without sanitisation.
- The component is architecturally a dead end: it cannot be composed with React children, cannot use hooks for per-section state, and cannot participate in code-splitting by section.

**Future migration path (not scheduled):**
Convert each landing page section (hero, features, how-it-works, footer) to a proper JSX component, wire strings through `useTranslation()`, and delete the raw HTML import. This conversion should be done section by section, with visual regression screenshots as the acceptance criterion. A new requirement file should be created to schedule this work.

**Supersedes:** nothing. **May be superseded by** a future ADR covering the JSX migration of the landing page.
