# Internationalization & Accessibility

Two cross-cutting concerns that touch every screen in **Flying Fridge**:
**internationalization (i18n)** and **accessibility (a11y)**. Both are baseline
requirements from `requirements/requirement-2.md` ("bootstrapped with i18n,
proper accessibility guidelines with a top-notch keyboard accessibility
baseline"), not afterthoughts.

> Tooling (react-i18next; Vitest + React Testing Library) is decided in
> `docs/adr/`. This document is the design/approach.

---

## Part A — Internationalization

### A.1 Approach

- **Library:** **react-i18next** (with `i18next`).
- **Default language:** **`en`**. Detect the user's preference from the browser
  (and later from `users/{uid}.locale`), falling back to `en`.
- **No hard-coded user-facing strings.** Every visible string, `aria-label`,
  placeholder, and error message comes from a translation key. This is enforced
  by convention and review; string literals in JSX are a smell.

### A.2 Setup & structure

`src/i18n/` owns configuration and resource bundles:

```
src/i18n/
├─ index.ts               # i18next init: default lng 'en', fallbackLng 'en', detection, react-i18next binding
└─ locales/
   ├─ en/                 # default — the source of truth for keys
   │  ├─ common.json      # shared: actions, nav, generic labels
   │  ├─ auth.json        # auth feature
   │  ├─ family.json      # family create/join
   │  ├─ tasks.json       # per-feature namespaces mirror features/*
   │  ├─ notices.json
   │  ├─ lostAndFound.json
   │  ├─ pantry.json
   │  └─ questions.json
   └─ <locale>/           # future locales mirror the en/ structure exactly
```

`main.tsx` imports the i18n init early (before the app renders) and wraps the
tree so `useTranslation()` is available everywhere.

### A.3 Key structure & conventions

- **Namespaced by feature**, dot-separated within a namespace:
  `tasks.list.empty`, `tasks.form.title.label`, `common.actions.save`.
- Namespaces mirror `features/*` folders, plus a `common` namespace for shared
  strings — so a feature's strings live next to its code conceptually.
- **Interpolation** for dynamic values: `tasks.card.due` →
  `"Due {{date}}"`, used as `t('tasks.card.due', { date })`.
- **Pluralization** via i18next plural keys (`_one` / `_other`) for counts
  ("1 item" / "5 items").
- **Dates/numbers** are formatted per-locale (Intl-based formatters, wired
  through i18next formatting) rather than concatenated by hand — important for
  the calendar view.
- Keys are **stable identifiers**, not English sentences; changing the English
  copy does not change the key.

### A.4 Adding a new locale

1. Copy `src/i18n/locales/en/` to `src/i18n/locales/<locale>/` (same file names,
   same keys).
2. Translate the **values**; keep the **keys** identical.
3. Register the locale in `src/i18n/index.ts` (add to resources / supported
   languages).
4. `en` remains `fallbackLng`, so any missing key gracefully falls back to
   English.
5. For **RTL** locales, ensure layout respects `dir="rtl"` (set on `<html>`) and
   that styles use logical properties — build this in from the start even though
   the first locale is LTR.

### A.5 Testing i18n

- Tests render with the i18n provider; assert on **translated output** (or via
  keys with a test config) so missing/renamed keys surface as failures.
- A lightweight check keeps non-default locales **key-complete** against `en`
  (no missing keys).

---

## Part B — Accessibility

### B.1 Target

**WCAG 2.1 Level AA** as the baseline, with a **keyboard-first** mindset
(Requirement 2 asks specifically for a top-notch keyboard baseline). Because
this is a **mobile-first** app, a11y also means large touch targets and clear
focus for external keyboards and switch access.

### B.2 Keyboard-first patterns

- **Everything operable without a mouse.** Every interactive element is
  reachable and activatable by keyboard, in a logical tab order that matches
  visual order.
- **Native semantics first.** Use real `<button>`, `<a>`, `<input>`,
  `<label>`, `<nav>`, `<main>` before reaching for ARIA. A `<div>` with a click
  handler is not acceptable.
- **Visible focus** on every focusable element — never remove focus outlines;
  provide a clear, high-contrast focus style (works in light and dark themes).
- **No keyboard traps.** Composite widgets (menus, tabs, calendar grid) follow
  the expected key interactions (arrow keys, Home/End, Enter/Space, Escape).
- **Skip link** ("Skip to main content") as the first focusable element.
- **Shortcuts, if any,** never collide with assistive-tech or browser keys.

### B.3 Focus management (SPA specifics)

- **Route changes:** on navigation, move focus to the new page's main heading
  (or `<main>`) and announce the change, so screen-reader and keyboard users
  aren't stranded at the old position.
- **Dialogs/sheets:** focus moves into the dialog on open, is **trapped** while
  open, returns to the triggering control on close, and `Escape` closes it.
  Background is inert (`aria-hidden`/`inert`).
- **Async updates:** use `aria-live` regions for toasts, "item marked found",
  optimistic writes, and errors so changes are announced without stealing
  focus.

### B.4 Structure, landmarks & semantics

- **One `<main>` per view**, plus `<header>`, `<nav>`, and `<footer>` landmarks
  so screen-reader users can jump between regions.
- **Logical heading hierarchy** (single `h1` per page, no skipped levels).
- **Forms:** every control has an associated `<label>`; errors are programmatically
  associated (`aria-describedby`) and announced; required/invalid states use
  `aria-required`/`aria-invalid`.
- **Icons/images:** meaningful ones have text alternatives; decorative ones are
  hidden from assistive tech (`aria-hidden`). The "flying fridge" branding art
  is decorative.
- **The five boards & views:** list items, calendar cells, and status toggles
  (e.g. "mark as found", "mark consumed") expose their state and action to
  assistive tech, not just visually.

### B.5 Visual: contrast, motion, theming

- **Color contrast** meets AA (4.5:1 for normal text, 3:1 for large text and
  meaningful UI/graphics). The per-category magnet colors from the landing page
  must be checked against text/background in **both** light and dark themes.
- **Not color alone** — status (open/done, lost/found, available/consumed) is
  conveyed with text/icon/shape too, not just hue.
- **Reduced motion:** honor `prefers-reduced-motion: reduce` — the landing
  page's fun animations are already gated on it; the app continues that,
  disabling non-essential motion and parallax.
- **Theme:** light/dark follow the system preference; contrast and focus styles
  are verified in both.
- **Responsive/zoom:** layout works at 320px width and up, and remains usable at
  200% zoom without loss of content or function (mobile-first helps here).

### B.6 Testing accessibility

- **Automated:** integrate an axe-based check (e.g. `jest-axe`/`axe-core` with
  Vitest + React Testing Library) into component tests to catch violations early.
- **Testing Library discipline:** query by **role/label/text** (as users and
  assistive tech do), not by test ids — this makes the semantics testable by
  construction.
- **Keyboard tests:** simulate `Tab`/`Enter`/`Escape`/arrow interactions for
  dialogs, menus, and the calendar grid.
- **Manual passes:** periodic keyboard-only walkthroughs and a screen-reader
  smoke test (e.g. NVDA/VoiceOver) on the core flows (sign in, join family,
  add/complete an item, switch list/calendar).
- **CI:** the a11y unit checks run in the **GitHub Actions** pipeline alongside
  the rest of the test suite, so regressions are caught on every change.

### B.7 Definition of done (a11y) for a feature

A feature is not "done" until:
- it is fully keyboard operable with visible focus;
- it uses correct landmarks/roles/labels and passes the automated axe check;
- dynamic changes are announced via `aria-live`;
- contrast passes AA in light **and** dark;
- motion respects `prefers-reduced-motion`;
- all strings go through i18n keys (ties back to Part A).
