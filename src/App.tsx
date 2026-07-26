import { useEffect, type ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import SkipLink from './components/a11y/SkipLink'
import TopBar from './components/TopBar'
import LandingPage from './pages/landing/LandingPage'
import GuidePage from './features/guide/GuidePage'
import NotFound from './pages/NotFound'
import AppHome from './pages/AppHome'
import { AuthProvider } from './features/auth/AuthProvider'
import { useAuth } from './features/auth/authContext'
import SignInPage from './features/auth/SignInPage'
import { FamilyProvider } from './features/family/FamilyProvider'
import { AppNavProvider } from './features/app/AppNavProvider'
import { useNavShortcuts } from './lib/shortcuts'

/**
 * The root route. Signed-in users skip the welcome/landing screen and land
 * straight in the app — with `replace`, so `/` is never left in history and the
 * Back button can't return them to the welcome screen. Signed-out visitors get
 * the landing page; during the brief auth check we render nothing to avoid a
 * welcome flash for members.
 */
export function Home() {
  const { status } = useAuth()
  if (status === 'loading') return null
  if (status === 'authenticated') return <Navigate to="/app" replace />
  return <LandingPage />
}

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
  const { pathname } = useLocation()
  useNavShortcuts()

  useEffect(() => {
    document.title = t('meta.title')
    document.documentElement.lang = i18n.language
  }, [t, i18n.language])

  // The landing page has its own header; every other route gets the shared TopBar.
  const showTopBar = pathname !== '/'

  return (
    <AuthProvider>
      <FamilyProvider>
        <AppNavProvider>
          <SkipLink />
          {showTopBar && <TopBar />}
          <Routes>
          <Route path="/" element={<Home />} />
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
        </AppNavProvider>
      </FamilyProvider>
    </AuthProvider>
  )
}
