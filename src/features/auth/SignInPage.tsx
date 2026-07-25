import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from './authContext'
import './auth.css'

export default function SignInPage() {
  const { t } = useTranslation()
  const { signInEmail, registerEmail, signInGoogle } = useAuth()
  const [mode, setMode] = useState<'signIn' | 'register'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError(t('auth.signIn.needFields'))
      return
    }
    setBusy(true)
    try {
      await (mode === 'signIn'
        ? signInEmail(email, password)
        : registerEmail(email, password))
    } catch {
      setError(t('auth.signIn.failed'))
    } finally {
      setBusy(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setBusy(true)
    try {
      await signInGoogle()
    } catch {
      setError(t('auth.signIn.failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="main-content" className="auth">
      <div className="auth-card">
        <h1 className="auth-title">{t('auth.signIn.title')}</h1>
        <p className="auth-subtitle">{t('auth.signIn.subtitle')}</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="auth-label" htmlFor="auth-email">
            {t('auth.signIn.email')}
          </label>
          <input
            id="auth-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label" htmlFor="auth-password">
            {t('auth.signIn.password')}
          </label>
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={busy}>
            {mode === 'signIn'
              ? t('auth.signIn.submit')
              : t('auth.signIn.register')}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">
          <span>{t('auth.signIn.or')}</span>
        </div>

        <button
          className="auth-google"
          type="button"
          onClick={onGoogle}
          disabled={busy}
        >
          {t('auth.signIn.google')}
        </button>

        <button
          className="auth-toggle"
          type="button"
          onClick={() => {
            setMode(mode === 'signIn' ? 'register' : 'signIn')
            setError(null)
          }}
        >
          {mode === 'signIn'
            ? t('auth.signIn.needAccount')
            : t('auth.signIn.haveAccount')}
        </button>
      </div>
    </main>
  )
}
