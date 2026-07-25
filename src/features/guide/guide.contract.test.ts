import en from '../../i18n/locales/en/translation.json'
import { GUIDE_MODULES, CORE_MODULE_IDS } from './modules'

/**
 * Guardrail (requirement-3): the in-app Guide must always stay in sync with the
 * set of documented modules. These tests fail CI if content drifts from the
 * registry. See docs/adr/0012-in-app-guide-and-docs-currency-policy.md.
 */

interface ModuleContent {
  title?: string
  summary?: string
  steps?: string[]
  tip?: string
}

const content = en.guide.modules as Record<string, ModuleContent>

describe('guide content contract', () => {
  it('every documented module has complete guide content', () => {
    for (const module of GUIDE_MODULES) {
      const c = content[module.id]
      expect(c, `missing guide content for module '${module.id}'`).toBeDefined()
      expect(
        typeof c.title === 'string' && c.title.length > 0,
        `module '${module.id}' needs a title`,
      ).toBe(true)
      expect(
        typeof c.summary === 'string' && c.summary.length > 0,
        `module '${module.id}' needs a summary`,
      ).toBe(true)
      expect(
        Array.isArray(c.steps) && c.steps.length > 0,
        `module '${module.id}' needs at least one step`,
      ).toBe(true)
    }
  })

  it('has no orphan guide content without a registry entry', () => {
    const registered = new Set(GUIDE_MODULES.map((m) => m.id))
    for (const id of Object.keys(content)) {
      expect(
        registered.has(id),
        `orphan guide content '${id}' has no entry in GUIDE_MODULES`,
      ).toBe(true)
    }
  })

  it('documents every core product module', () => {
    const registered = new Set(GUIDE_MODULES.map((m) => m.id))
    for (const id of CORE_MODULE_IDS) {
      expect(registered.has(id), `core module '${id}' is not documented`).toBe(
        true,
      )
    }
  })

  it('uses unique module ids and slugs', () => {
    const ids = GUIDE_MODULES.map((m) => m.id)
    const slugs = GUIDE_MODULES.map((m) => m.slug)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
