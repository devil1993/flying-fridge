# 0003 — TypeScript as the Project Language

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Technology

## Context

The project moves from the Requirement 1 phase (a single, plain-HTML file — `index.html`) into a full React application (Requirement 2, `requirements/requirement-2.md`). A language choice must be made before any source files are created. The codebase will be maintained over multiple requirement cycles with different feature agents (see `.claude/agents/`) working on isolated modules; type safety is the primary coordination mechanism when there is no single person reviewing every file.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **TypeScript** | Compile-time error detection; self-documenting contracts between modules and agents; full IDE support (autocomplete, rename, find-references); Firebase SDK v10 ships its own types | Added compilation step; requires tsconfig discipline; some libraries have incomplete or incorrect type definitions |
| JavaScript (plain ES modules) | Zero overhead; simpler tooling | No compiler catching shape mismatches between Firebase documents, store slices, and components; riskier when multiple agents work on separate modules |
| JavaScript + JSDoc type annotations | Types without a build step | Tooling support is weaker; JSDoc is verbose; annotations drift out of sync more easily than `.ts` files |

## Decision

Use **TypeScript** throughout. All source files under `src/` will use `.ts` / `.tsx` extensions. The tsconfig will enable strict mode (`strict: true`) so that the compiler is meaningful rather than decorative. The `.claude/agents/feature-module-builder.md` agent specification explicitly demands adherence to the project's tsconfig strictness flags (`noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`).

## Consequences

**Positive:**
- Firestore document shapes, shared domain types (family, board item, user), and component props are all checked at compile time — catching mismatches before runtime.
- Multiple agents can work on separate feature directories (a pattern described in `.claude/agents/feature-module-builder.md`) with the type system enforcing the contracts between them.
- Refactoring (renaming a field, changing a function signature) is safe across the codebase.

**Negative / costs:**
- Every new file must satisfy the compiler before Vite will build. This adds a small friction cost when prototyping.
- Firebase SDK types occasionally lag or diverge from runtime behaviour; some casts or type assertions will be necessary at SDK boundaries.
- `strict: true` with `noUncheckedIndexedAccess` requires index-access guards (e.g. `items[0]` becomes `items[0] ?? fallback`) which is more verbose but genuinely safer.

**Deferred:**
- The specific tsconfig paths and compiler options will be finalised when the `src/` scaffold is created in Requirement 2.
