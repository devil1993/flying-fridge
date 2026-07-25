# In-app Guide

The `/guide` route is a user-facing guide with an entry per module, so people
can discover how each part of Flying Fridge behaves. It is **data-driven** and
**guardrailed** so it cannot silently fall out of date. Decision record:
[ADR-0012](../adr/0012-in-app-guide-and-docs-currency-policy.md).

## Shape

```
src/features/guide/
├─ modules.ts              # registry: GUIDE_MODULES + CORE_MODULE_IDS (source of truth)
├─ moduleIcons.tsx         # id -> inline SVG icon (currentColor, tinted per module accent)
├─ GuidePage.tsx           # renders intro + a section per module from i18n
├─ guide.css               # styles (uses global design tokens)
├─ guide.contract.test.ts  # GUARDRAIL — see below
└─ GuidePage.test.tsx      # route + rendering test
```

- **Registry** (`modules.ts`) is the single source of truth for *which* modules
  exist. Each entry is `{ id, slug, accentVar }`.
- **Content** lives in i18n under `guide.modules.<id>` (`src/i18n/locales/`),
  each with `title`, `summary`, `steps[]`, and `tip` — so the guide is
  translatable like the rest of the app.
- `GuidePage` maps over `GUIDE_MODULES`, pulling content by key and rendering an
  accessible page: `<main id="main-content">`, an in-page table of contents
  (`<nav aria-label>`), and one `<section aria-labelledby>` per module.

## Guardrail (why it stays current)

`guide.contract.test.ts` fails CI if the guide drifts:

1. **Completeness** — every module in `GUIDE_MODULES` has non-empty
   `title`, `summary`, and at least one `step`.
2. **No orphans** — every `guide.modules.<id>` content block has a matching
   registry entry (so removing a module can't leave dangling content, and
   adding content without registering is caught).
3. **Core coverage** — every id in `CORE_MODULE_IDS`
   (`tasks, notices, lostFound, pantry, questions`) is documented.
4. **Uniqueness** — ids and slugs are unique.

This enforces *existence*, not *accuracy* — the text still needs review to stay
truthful. As each feature module is built (requirement-4), expand its guide
entry and add feature-specific checks alongside it.

## Adding or changing a module (checklist)

In the **same change** as the code (docs-currency policy, ADR-0012):

1. Add/adjust the entry in `src/features/guide/modules.ts`.
2. Add/adjust its content under `guide.modules.<id>` in the locale files.
3. Add an icon in `moduleIcons.tsx` if new.
4. Run `pnpm test:run` — the contract tests must pass.
5. Update related docs / the LikeC4 model if the module's behavior or data
   model changed.
