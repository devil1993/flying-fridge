import { useState, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { useFamily } from '../features/family/familyContext'
import TasksDashboard from '../features/tasks/TasksDashboard'
import NoticesBoard from '../features/notices/NoticesBoard'
import './app-shell.css'

interface TabDef {
  id: string
  labelKey: string
  Comp: ComponentType
}

const TABS: TabDef[] = [
  { id: 'tasks', labelKey: 'tasks.title', Comp: TasksDashboard },
  { id: 'notices', labelKey: 'notices.title', Comp: NoticesBoard },
]

/** Signed-in app shell: family header + a sub-nav across the feature modules. */
export default function AppShell() {
  const { t } = useTranslation()
  const { familyName, familyId, leave } = useFamily()
  const [active, setActive] = useState('tasks')
  const Active = TABS.find((tab) => tab.id === active)?.Comp ?? TasksDashboard

  return (
    <main id="main-content" className="app-shell">
      <div className="app-shell-wrap">
        <header className="app-shell-head">
          <h1 className="app-shell-title">{t('app.title')}</h1>
          <div className="app-shell-family">
            <span className="app-shell-familyname">
              {t('tasks.family.current', { name: familyName ?? familyId })}
            </span>
            <button type="button" className="dash-link" onClick={leave}>
              {t('tasks.family.leave')}
            </button>
          </div>
        </header>

        <nav className="app-tabs" aria-label={t('app.sections')}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === active ? 'app-tab is-active' : 'app-tab'}
              aria-current={tab.id === active ? 'page' : undefined}
              onClick={() => setActive(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>

        <Active />
      </div>
    </main>
  )
}
