import { useTranslation } from 'react-i18next'
import { useAuth } from '../features/auth/authContext'

/**
 * Signed-in landing area. Placeholder for now — the Tasks dashboard lands here
 * in the next increment of the requirement-4 vertical slice.
 */
export default function AppHome() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  return (
    <main
      id="main-content"
      style={{ padding: '2.5rem 1.5rem', maxWidth: 720, margin: '0 auto' }}
    >
      <h1>{t('auth.appTitle')}</h1>
      <p>{t('auth.signedInAs', { name: user?.name ?? '' })}</p>
      <button type="button" className="auth-google" onClick={() => void signOut()}>
        {t('auth.signOut')}
      </button>
      <p style={{ marginTop: '1.5rem', color: 'var(--col-text-muted)' }}>
        {t('auth.dashboardComing')}
      </p>
    </main>
  )
}
