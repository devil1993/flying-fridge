import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeControls from './ThemeControls'
import { useAuth } from '../features/auth/authContext'
import { useFamily } from '../features/family/familyContext'
import { useAppNav, APP_MODULES } from '../features/app/appNav'
import { shortcutFor } from '../lib/shortcuts'
import './topbar.css'

/**
 * App-wide top navigation, shown on every route except the landing page. In the
 * signed-in app (with a family) it carries the module tabs + switch-family;
 * otherwise it shows the App/Guide links. Collapses to a hamburger on mobile.
 */
export default function TopBar() {
  const { t } = useTranslation()
  const { status, signOut } = useAuth()
  const { familyId, familyName, leave } = useFamily()
  const { active, setActive } = useAppNav()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const inApp =
    pathname.startsWith('/app') && status === 'authenticated' && !!familyId

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)
  const titleFor = (label: string, path: string) => {
    const key = shortcutFor(path)
    return key ? `${label} · ${t('nav.shortcut', { key })}` : label
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-inner">
        <Link
          to="/"
          className="topbar-brand"
          title={titleFor(t('app.name'), '/')}
          onClick={close}
        >
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect x="6" y="3" width="24" height="30" rx="4" fill="var(--col-primary)" opacity="0.15" />
            <rect x="6" y="3" width="24" height="30" rx="4" stroke="var(--col-primary)" strokeWidth="2" />
            <line x1="6" y1="13" x2="30" y2="13" stroke="var(--col-primary)" strokeWidth="2" />
            <circle cx="12" cy="8.5" r="2.5" fill="var(--col-primary)" />
          </svg>
          <span>{t('app.name')}</span>
        </Link>

        <button
          type="button"
          className="topbar-burger"
          aria-label={t('nav.menu')}
          aria-expanded={open}
          aria-controls="topbar-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>

        <div id="topbar-menu" className={open ? 'topbar-menu is-open' : 'topbar-menu'}>
          <nav className="topbar-nav" aria-label={t('nav.appLabel')}>
            {inApp ? (
              APP_MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={m.id === active ? 'topbar-tab is-active' : 'topbar-tab'}
                  aria-current={m.id === active ? 'page' : undefined}
                  title={`${t(m.labelKey)} · ${t('nav.shortcut', { key: m.shortcut.toUpperCase() })}`}
                  onClick={() => {
                    setActive(m.id)
                    close()
                  }}
                >
                  {t(m.labelKey)}
                </button>
              ))
            ) : (
              <Link to="/app" title={titleFor(t('nav.app'), '/app')} onClick={close}>
                {t('nav.app')}
              </Link>
            )}
            <Link to="/guide" title={titleFor(t('nav.guide'), '/guide')} onClick={close}>
              {t('nav.guide')}
            </Link>
          </nav>

          <div className="topbar-actions">
            {inApp && (
              <span className="topbar-family">
                <span className="topbar-familyname">{familyName ?? familyId}</span>
                <button
                  type="button"
                  className="topbar-switch"
                  onClick={() => {
                    leave()
                    close()
                  }}
                >
                  {t('tasks.family.leave')}
                </button>
              </span>
            )}
            <ThemeControls />
            {status === 'authenticated' ? (
              <button
                type="button"
                className="topbar-auth"
                onClick={() => {
                  close()
                  void signOut()
                }}
              >
                {t('auth.signOut')}
              </button>
            ) : (
              <Link to="/app" className="topbar-auth" onClick={close}>
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
