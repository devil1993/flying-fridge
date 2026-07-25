/**
 * Registry of the modules documented in the in-app Guide — the single source
 * of truth for "which modules exist". Human-readable content lives in i18n
 * under `guide.modules.<id>` (src/i18n/locales/). The contract tests in
 * guide.contract.test.ts fail if a module here has no content, if there is
 * orphan content with no entry here, or if a core product module is missing.
 *
 * When a feature module is added or changed, update this registry AND its
 * guide content in the same change (see ADR-0012, docs currency policy).
 */
export interface GuideModule {
  /** Stable id; also the i18n key under `guide.modules.<id>`. */
  id: string
  /** URL hash / in-page anchor slug. */
  slug: string
  /** CSS custom property used as this module's accent colour. */
  accentVar: string
}

export const GUIDE_MODULES: GuideModule[] = [
  { id: 'tasks', slug: 'tasks', accentVar: '--mag-tasks' },
  { id: 'notices', slug: 'notices', accentVar: '--mag-notices' },
  { id: 'lostFound', slug: 'lost-found', accentVar: '--mag-lostfound' },
  { id: 'pantry', slug: 'pantry', accentVar: '--mag-pantry' },
  { id: 'questions', slug: 'questions', accentVar: '--mag-questions' },
  { id: 'notifications', slug: 'notifications', accentVar: '--mag-notices' },
  { id: 'appearance', slug: 'appearance', accentVar: '--col-primary' },
]

/** The core product modules that must always be documented in the Guide. */
export const CORE_MODULE_IDS = [
  'tasks',
  'notices',
  'lostFound',
  'pantry',
  'questions',
] as const
