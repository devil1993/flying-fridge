import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <main
      id="main-content"
      style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}
    >
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <Link to="/">{t('notFound.home')}</Link>
    </main>
  )
}
