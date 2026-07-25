import { useFamily } from '../features/family/familyContext'
import FamilySetup from '../features/family/FamilySetup'
import AppShell from './AppShell'

/** The signed-in area: pick/enter a family, then the module shell. */
export default function AppHome() {
  const { familyId } = useFamily()
  if (!familyId) return <FamilySetup />
  return <AppShell />
}
