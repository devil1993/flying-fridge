import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import './family.css'

/** Shown when a signed-in user isn't a member of any family yet. */
export default function NoFamily() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <main id="main-content" className="family-setup">
      <div className="family-card">
        <h1>{t('family.none.title')}</h1>
        <p>{t('family.none.body')}</p>
        <p className="family-uid-label">{t('family.none.yourId')}</p>
        <code className="family-uid">{user?.id}</code>
        {user?.email && <p className="family-email">{user.email}</p>}
      </div>
    </main>
  )
}
