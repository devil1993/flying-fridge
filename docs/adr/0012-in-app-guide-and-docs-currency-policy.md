# 0012 — In-App Guide (Data-Driven + Contract-Tested) and Documentation-Currency Policy

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Architecture / Process

## Context

`requirements/requirement-3.md` introduced two coupled problems:

**Problem 1 — discoverability.** As Flying Fridge grows module by module (tasks, notices, lost & found, pantry, questions — plus UI features like live theming), there is no in-app surface that explains what each module does or how to use it. A help page that is disconnected from the codebase will drift immediately; one that is maintained only by discipline will drift slowly. Neither is acceptable for a family-facing app where confused users just stop using the product.

**Problem 2 — documentation drift.** Early requirements produced ADRs, design docs, a LikeC4 architecture model (`docs/design/architecture/flying-fridge.c4`), and i18n resources (ADR-0007), but there was no explicit rule that every change must keep all of these in sync. Requirement-3 NFR and requirement-4 technical requirements both demand that docs/ADRs/specs, the LikeC4 C4 model, and the in-app Guide are updated in the **same change** as the functional code they describe. This must be a standing policy, not an aspiration.

## Options Considered

### Option A — Static help page (hard-coded HTML/JSX)

| Aspect | Detail |
|--------|--------|
| Pros | Fast to implement; no extra abstraction |
| Cons | No mechanical link between "modules that exist" and "modules that are documented"; guaranteed to drift; cannot be lint-checked or contract-tested; violates the i18n baseline (ADR-0007) if strings are hard-coded |

### Option B — CMS or external documentation site

| Aspect | Detail |
|--------|--------|
| Pros | Rich authoring; could be maintained by non-developers |
| Cons | Flying Fridge has no backend CMS (ADR-0002 uses Firebase, not a headless CMS); external docs sites are a second place to maintain and the canonical drift problem simply moves there; out of scope for the current stack and team size |

### Option C — Data-driven module registry + i18n content + contract tests (chosen)

| Aspect | Detail |
|--------|--------|
| Pros | Single source of truth for which modules exist (`src/features/guide/modules.ts`); content lives in the i18n pipeline already established by ADR-0007 (`src/i18n/locales/`); contract tests enforce completeness mechanically so CI catches missing or orphaned content before it ships |
| Cons | Registry and content are two places to keep in sync (the orphan-check test mitigates this but does not eliminate it); contract tests verify *existence* of content, not its *accuracy* — a wrong-but-present step passes the check; adds a small authoring ceremony (registry entry + i18n keys) for every new module |

### Documentation-currency options

| Option | Assessment |
|--------|------------|
| Best-effort ("try to remember") | The baseline before this ADR; demonstrably insufficient |
| Automated doc generation from code | Attractive in principle; most architecture docs (LikeC4 models, ADR prose, guide text) require human judgment and cannot be generated; ruled out as incomplete |
| **Policy enforced at PR level: same-change rule** | Adds friction to every PR deliberately; the friction is the point — it makes the cost of skipping docs visible and reviewable |

## Decision

### Decision 1 — In-app Guide with a data-driven registry and contract tests

Introduce a `/guide` route. The guide is governed by a **typed module registry** at `src/features/guide/modules.ts`, which exports:

- `GUIDE_MODULES` — an array of `GuideModuleDefinition` objects, each carrying an `id`, an i18n key prefix, and metadata (icon slug, order).
- `CORE_MODULE_IDS` — a typed tuple of the five core product module IDs that **must** be documented: `tasks`, `notices`, `lostFound`, `pantry`, `questions`. An `appearance` entry documents live theme and accessibility features (cross-reference ADR-0008).

Human-readable content (title, summary, steps) lives exclusively in i18n resources under the namespace `guide.modules.<id>` (`src/i18n/locales/en/translation.json` and any future locale files). No guide text is hard-coded in JSX.

**Contract tests** at `src/features/guide/*.contract.test.ts` enforce three invariants in CI (cross-reference ADR-0009):

1. Every entry in `GUIDE_MODULES` has a corresponding i18n key with a non-empty `title`, `summary`, and at least one `steps` entry — no documented module may lack content.
2. No i18n key under `guide.modules.*` exists without a matching `GUIDE_MODULES` entry — no orphan content.
3. Every ID in `CORE_MODULE_IDS` appears in `GUIDE_MODULES` — no core product module is silently undocumented.

These tests run as part of the normal `pnpm test:run` suite. A failing contract test blocks merge.

### Decision 2 — Standing documentation-currency policy

From requirement-3 onwards, every pull request that adds or modifies a functional behaviour **must**, in the same commit or PR:

- Update the relevant design doc(s) under `docs/design/`.
- Add or update the relevant ADR(s) under `docs/adr/` (new decisions get a new record; reversed decisions get a superseding record — history is not rewritten).
- Update the LikeC4 architecture model (`docs/design/architecture/flying-fridge.c4`) when components, data flows, or data models change. Requirement-4 technical requirements specifically call out that the C4 model must reflect actual components and data models as they are built.
- Update the in-app Guide registry and i18n content so the contract tests continue to pass.

This is a **persistent, repeating requirement** — it applies to every requirement cycle from this point forward and is not discharged by completing it once.

## Consequences

**Positive:**
- The guide cannot ship with a documented module that has no content, nor with content that references a non-existent module. CI is the enforcer, not discipline.
- Guide content participates in the i18n pipeline (ADR-0007), so adding a second locale automatically extends the guide to cover all modules without any new registry work.
- The same-change policy makes documentation debt visible at review time rather than accumulation time.
- The LikeC4 model (`pnpm arch`) stays honest: it reflects the components and data models that were actually built, not an aspirational design from an earlier requirement.

**Negative / costs:**
- **Contract tests verify existence, not accuracy.** A step that says "click the button" and is factually wrong about which button will pass CI. Accuracy remains a human review concern.
- **Registry + i18n is two places.** A developer who adds i18n keys without a registry entry will be caught by the orphan test. A developer who adds a registry entry without i18n keys will be caught by the content-existence test. Both catches require a test run, not a compile step — the feedback loop is slightly slower than a type error.
- **Same-change policy adds friction to every PR.** A small feature touch now requires updating docs, the C4 model, and the guide. This friction is accepted deliberately: it was deemed less costly than the accumulated confusion of drifted documentation that requirement-3 was written to address.
- The guide UI (`/guide` route) adds a surface that must itself satisfy the accessibility baseline (ADR-0008) and be keyboard-navigable, which is a non-trivial implementation cost per module.

**Deferred:**
- Guide content accuracy checking beyond existence (e.g., screenshot-based visual validation of steps) — not scheduled.
- Multi-locale guide content beyond English — follows from ADR-0007; no additional registry work required, only translation JSON files.
- A CI lint rule that rejects PRs whose diff touches `src/features/` without touching `docs/` — currently relies on review; automating this check is a future tooling improvement.

**Cross-references:**
- ADR-0007: i18n pipeline that guide content feeds into.
- ADR-0008: accessibility baseline that the `/guide` route must satisfy.
- ADR-0009: testing strategy; contract tests run in the same Vitest suite.
- ADR-0011: landing page; not yet i18n-wired — an existing known gap that this policy does not retroactively fix but does prevent from recurring in new work.
- `docs/design/architecture/flying-fridge.c4`: the LikeC4 model that the currency policy requires to stay current.

**Supersedes:** nothing. **May be superseded by** a future ADR if the guide architecture changes (e.g., moves to a CMS) or if the same-change policy is automated at the CI level.
