import { useFamily } from '../features/family/familyContext'
import FamilySetup from '../features/family/FamilySetup'
import TasksDashboard from '../features/tasks/TasksDashboard'

/** The signed-in area: pick/enter a family, then the Tasks dashboard. */
export default function AppHome() {
  const { familyId } = useFamily()
  if (!familyId) return <FamilySetup />
  return <TasksDashboard />
}
