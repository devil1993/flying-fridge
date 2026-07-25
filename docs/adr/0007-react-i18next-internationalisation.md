# 0007 — Internationalisation via react-i18next

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Technology

## Context

`requirements/requirement-2.md` specifies that the app should be "bootstrapped with i18n". The `PROGRESS.md` backlog lists localisation as a candidate feature. Even if the app launches in English only, wiring i18n from the start prevents the expensive later work of finding every hard-coded string in the codebase and replacing it. The choice must integrate naturally with React and TypeScript, be compatible with the Vite build (ADR-0004), and impose minimal runtime overhead for a mobile-first app (ADR-0006).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **react-i18next** | De-facto standard for React i18n; hooks (`useTranslation`) and HOCs; TypeScript types for translation keys; lazy-loads locale JSON; large community; active maintenance | Adds `i18next` + `react-i18next` to the bundle; API surface is large (most of it unused for simple cases) |
| react-intl (FormatJS) | Strong ICU message format support; good TypeScript | More verbose API; heavier bundle; less idiomatic in small React codebases |
| Lingui | Excellent DX; macro-based extraction; compact runtime | Requires Babel macros or a Vite plugin; less common — fewer examples in the ecosystem |
| Hand-rolled string map | Zero dependency | Does not scale; no pluralisation, interpolation, date/number formatting; reinventing the wheel |

## Decision

Use **react-i18next** with the following conventions:

- Default locale: **`en`** (English).
- Translation files live under `src/locales/{locale}/translation.json` — the folder structure is ready for additional locales to be dropped in.
- All user-facing strings are referenced via the `t()` function from `useTranslation()`; hard-coded UI strings in source files are not permitted after bootstrap.
- Locale namespacing uses a single `translation` namespace initially; feature-level namespaces can be split out in a later requirement.

## Consequences

**Positive:**
- Adding a new locale requires only a new JSON file under `src/locales/` and a one-line loader registration — no source code changes.
- The `t('key')` call pattern is grep-able and auditable; a future `i18next-scanner` pass can find untranslated strings automatically.
- TypeScript key inference (via `i18next` type augmentation) can catch missing translation keys at compile time once the type declaration is set up.

**Negative / costs:**
- Every new string must be added to `src/locales/en/translation.json` and referenced by key, rather than written inline. This is a small but consistent discipline cost — a string written directly in JSX is a lint violation.
- The landing page (see ADR-0011) is currently **not i18n-wired**; it is rendered as raw HTML and bypasses the `t()` pipeline. It must be migrated to JSX and wired to i18n in a future requirement.
- `i18next`'s initialisation is async (locale JSON is loaded on demand). Components that render before initialisation completes will show an empty state unless a `Suspense` boundary or synchronous fallback is used.

**Deferred:**
- Right-to-left (RTL) language support — deferred; requires CSS `dir` changes and layout review.
- Locale auto-detection from the browser `Accept-Language` header — deferred to when a second locale is added.
- Splitting translation files by feature namespace — deferred to when the single `translation.json` becomes unwieldy.
