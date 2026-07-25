import { useTranslation } from 'react-i18next'
import { useFamily } from '../features/family/familyContext'
import NoFamily from '../features/family/NoFamily'
import AppShell from './AppShell'

/** The signed-in area: resolve the user's family, then the module shell. */
export default function AppHome() {
  const { t } = useTranslation()
  const { status } = useFamily()

  if (status === 'loading') {
    return (
      <main
        id="main-content"
        style={{ padding: '4rem 1.5rem', textAlign: 'center' }}
      >
        <p>{t('family.loading')}</p>
      </main>
    )
  }
  if (status === 'none') return <NoFamily />
  return <AppShell />
}
