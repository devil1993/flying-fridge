import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import SkipLink from './components/a11y/SkipLink'
import LandingPage from './pages/landing/LandingPage'
import NotFound from './pages/NotFound'

export default function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('meta.title')
    document.documentElement.lang = i18n.language
  }, [t, i18n.language])

  return (
    <>
      <SkipLink />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
