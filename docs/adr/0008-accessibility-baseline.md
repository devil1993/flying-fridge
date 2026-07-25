# 0008 — Accessibility Baseline — WCAG 2.1 AA

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Process / Quality

## Context

`requirements/requirement-2.md` asks the app to be "bootstrapped with proper accessibility guidelines with top-notch keyboard accessibility baseline." This is not a future milestone — it is a standing quality bar established at project inception. Retrofitting accessibility into an existing codebase is significantly more expensive than building it in from the start; this ADR codifies what "accessible" means for Flying Fridge so it is not re-litigated on every PR.

The app is also a PWA (ADR-0006) used by a family, potentially including members with disabilities, older relatives, or users who rely on keyboard navigation or assistive technology.

## Options Considered

The question is not *whether* to be accessible but *which standard* and *which enforcement mechanisms* to adopt.

| Option | Pros | Cons |
|--------|------|------|
| **WCAG 2.1 AA + eslint-plugin-jsx-a11y + keyboard-first development convention** | Industry-standard target; AA is achievable and legally defensible; lint catches common mistakes automatically during development | AA does not guarantee all users are served; lint only catches static patterns — dynamic a11y issues (focus management after navigation, ARIA live regions) still need manual review |
| WCAG 2.1 A only | Lower bar, less work | Misses high-impact criteria (colour contrast, keyboard traps, labels) — real users are harmed |
| WCAG 2.2 AA | More up-to-date | Adds criteria around dragging movements and target size; the incremental cost is low, but 2.1 AA is still the most widely referenced and tested-against level |
| No formal target, ad-hoc fixes | No overhead | Accessibility is consistently deprioritised; known from industry experience that retrofits cost 3–5× as much |

## Decision

The standing quality bar for Flying Fridge is **WCAG 2.1 AA**. This means:

- **Semantic HTML** — use `<nav>`, `<main>`, `<section>`, `<button>`, `<label>` etc. correctly. `<div onClick>` is a code-review failure.
- **Keyboard-first interaction** — every interactive element must be reachable and operable via keyboard alone (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, arrow keys where appropriate). Focus order must follow visual/logical order.
- **Visible focus indicators** — the browser default or a custom `:focus-visible` ring must always be visible. `outline: none` without a replacement is a code-review failure.
- **Sufficient colour contrast** — 4.5:1 for normal text, 3:1 for large text and UI components.
- **`eslint-plugin-jsx-a11y`** is included in the ESLint configuration and runs in CI. Lint failures block the build.
- **ARIA attributes** are used only to supplement semantic HTML, not as a replacement for it.

## Consequences

**Positive:**
- Keyboard navigation, screen reader compatibility, and contrast compliance benefit all users — not only those with disabilities (e.g. power-keyboard users, bright-outdoor mobile contrast).
- `eslint-plugin-jsx-a11y` catches the most common mistakes (missing `alt`, unlabelled form controls, invalid ARIA roles) at the point of authoring, before code review.
- Establishing the baseline now means feature agents (`.claude/agents/`) know the bar without negotiation.

**Negative / costs:**
- Every interactive component must be designed and tested for keyboard operation — this takes more time than mouse-only implementation, especially for custom UI patterns (modals, dropdowns, date pickers).
- `eslint-plugin-jsx-a11y` has false positives (e.g. dynamic ARIA attributes it cannot analyse statically) and false negatives (it cannot detect focus trap bugs or live region misfires).
- Dynamic focus management — moving focus to a newly opened modal, returning it on close, trapping it inside — must be handled manually with `ref`s and `useEffect`. There is no lint rule for this; it requires deliberate code and manual testing.
- The landing page (ADR-0011) is currently imported as raw HTML and is **not audited against this baseline** in its current form. It must be migrated and reviewed as part of the JSX/i18n migration.

**Deferred:**
- Formal accessibility audit (e.g. Axe, Lighthouse, screen reader manual test) — deferred to after the first real feature UI is built.
- WCAG 2.2 delta criteria (dragging alternatives, focus appearance) — noted for consideration at next accessibility review.
