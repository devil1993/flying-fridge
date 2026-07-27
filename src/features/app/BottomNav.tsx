import { useTranslation } from 'react-i18next'
import { useAppNav, APP_MODULES } from './appNav'
import { moduleIcon } from '../guide/moduleIcons'
import './bottom-nav.css'

/**
 * Mobile-only bottom navigation (hidden ≥720px, where the top bar shows inline
 * tabs). Icon-only tabs for the content boards — the thumb-reachable, always-
 * visible pattern a family checks constantly. Settings + Guide stay in the top
 * hamburger as overflow. See ADR-0016. Reuses the Guide's module icons so the
 * iconography is consistent app-wide.
 */
const NAV_MODULES = APP_MODULES.filter((m) => m.id !== 'settings')

export default function BottomNav() {
  const { t } = useTranslation()
  const { active, setActive } = useAppNav()

  return (
    <nav className="bottom-nav" aria-label={t('nav.appLabel')}>
      {NAV_MODULES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={m.id === active ? 'bottom-nav-item is-active' : 'bottom-nav-item'}
          aria-current={m.id === active ? 'page' : undefined}
          aria-label={t(m.labelKey)}
          onClick={() => setActive(m.id)}
        >
          <span className="bottom-nav-icon" aria-hidden="true">
            {moduleIcon(m.id)}
          </span>
        </button>
      ))}
    </nav>
  )
}
