import { useTranslation } from 'react-i18next'
import { useAuth } from '../features/auth/authContext'
import { useFamily } from '../features/family/familyContext'
import ThemeControls from '../components/ThemeControls'
import { track } from '../lib/firebase'
import './settings.css'

const LANGS = [
  { code: 'en', labelKey: 'settings.languageEn' },
  { code: 'bn', labelKey: 'settings.languageBn' },
]

export default function SettingsView() {
  const { t, i18n } = useTranslation()
  const { user, signOut } = useAuth()
  const { familyName, members } = useFamily()
  const current = i18n.language?.startsWith('bn') ? 'bn' : 'en'

  return (
    <section className="module settings" aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="module-title">
        {t('settings.title')}
      </h1>

      <div className="settings-group">
        <h2>{t('settings.appearance')}</h2>
        <ThemeControls />
      </div>

      <div className="settings-group">
        <h2 id="settings-lang">{t('settings.language')}</h2>
        <select
          className="settings-select"
          aria-labelledby="settings-lang"
          value={current}
          onChange={(e) => {
            void i18n.changeLanguage(e.target.value)
            void track('language_change', { lang: e.target.value })
          }}
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {t(l.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <h2>{t('settings.family')}</h2>
        {familyName && <p className="settings-value">{familyName}</p>}
        {members.length > 0 && (
          <ul className="settings-members">
            {members.map((m) => (
              <li key={m.uid}>{m.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="settings-group">
        <h2>{t('settings.account')}</h2>
        {(user?.email || user?.name) && (
          <p className="settings-value">{user?.email ?? user?.name}</p>
        )}
        <button
          type="button"
          className="settings-signout"
          onClick={() => void signOut()}
        >
          {t('settings.signOut')}
        </button>
      </div>
    </section>
  )
}
