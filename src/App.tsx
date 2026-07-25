import { useEffect, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import SkipLink from './components/a11y/SkipLink'
import LandingPage from './pages/landing/LandingPage'
import GuidePage from './features/guide/GuidePage'
import NotFound from './pages/NotFound'
import AppHome from './pages/AppHome'
import { AuthProvider } from './features/auth/AuthProvider'
import { useAuth } from './features/auth/authContext'
import SignInPage from './features/auth/SignInPage'
import { FamilyProvider } from './features/family/FamilyProvider'

/** Gates a route behind authentication; shows sign-in when signed out. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const { t } = useTranslation()
  if (status === 'loading') {
    return (
      <main
        id="main-content"
        style={{ padding: '4rem 1.5rem', textAlign: 'center' }}
      >
        <p>{t('auth.signIn.loading')}</p>
      </main>
    )
  }
  if (status === 'unauthenticated') return <SignInPage />
  return <>{children}</>
}

export default function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('meta.title')
    document.documentElement.lang = i18n.language
  }, [t, i18n.language])

  return (
    <AuthProvider>
      <FamilyProvider>
        <SkipLink />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppHome />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FamilyProvider>
    </AuthProvider>
  )
}
