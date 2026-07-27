import type { ComponentType } from 'react'
import { useAppNav } from '../features/app/appNav'
import { useModuleShortcuts } from '../features/app/useModuleShortcuts'
import { useFeatureTelemetry } from '../features/app/useFeatureTelemetry'
import DashboardView from './DashboardView'
import TasksDashboard from '../features/tasks/TasksDashboard'
import NoticesBoard from '../features/notices/NoticesBoard'
import LostFoundBoard from '../features/lostfound/LostFoundBoard'
import PantryBoard from '../features/pantry/PantryBoard'
import QuestionsBoard from '../features/questions/QuestionsBoard'
import SettingsView from './SettingsView'
import BottomNav from '../features/app/BottomNav'
import './app-shell.css'

const VIEWS: Record<string, ComponentType> = {
  dashboard: DashboardView,
  tasks: TasksDashboard,
  notices: NoticesBoard,
  lostFound: LostFoundBoard,
  pantry: PantryBoard,
  questions: QuestionsBoard,
  settings: SettingsView,
}

/**
 * Signed-in app body. Navigation (module tabs + switch family) lives in the
 * TopBar; this just renders the active module.
 */
export default function AppShell() {
  const { active } = useAppNav()
  useModuleShortcuts()
  const { onClickCapture } = useFeatureTelemetry(active)
  const Active = VIEWS[active] ?? DashboardView
  return (
    <>
      <main id="main-content" className="app-shell" onClickCapture={onClickCapture}>
        <div className="app-shell-wrap">
          <Active />
        </div>
      </main>
      <BottomNav />
    </>
  )
}
