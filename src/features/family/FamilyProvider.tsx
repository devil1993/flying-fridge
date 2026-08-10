import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/authContext'
import {
  DEMO_FAMILY_ID,
  DEMO_FAMILY_NAME,
  DEMO_MEMBERS,
} from '../demo/demoData'
import { familyRepository } from './familyRepositoryInstance'
import {
  FamilyContext,
  type FamilyContextValue,
  type FamilyStatus,
  type Family,
} from './familyContext'

/**
 * Resolves the signed-in user's family from the backend (families where the
 * user is a member). Families are bootstrapped manually for now — see
 * human-instructions/03-bootstrap-family.md.
 */
export function FamilyProvider({ children }: { children: ReactNode }) {
  const { user, status: authStatus, isDemo } = useAuth()
  const [family, setFamily] = useState<Family | null>(null)
  const [status, setStatus] = useState<FamilyStatus>('loading')

  useEffect(() => {
    // Demo mode: a ready-made sample family, no backend.
    if (isDemo) {
      setFamily({
        id: DEMO_FAMILY_ID,
        name: DEMO_FAMILY_NAME,
        memberUids: DEMO_MEMBERS.map((m) => m.uid),
        members: DEMO_MEMBERS,
      })
      setStatus('ready')
      return
    }
    if (authStatus === 'loading') {
      setStatus('loading')
      return
    }
    if (authStatus !== 'authenticated' || !user) {
      setFamily(null)
      setStatus('none')
      return
    }
    setStatus('loading')
    return familyRepository.subscribeMine(user.id, (families) => {
      if (families.length > 0) {
        setFamily(families[0])
        setStatus('ready')
      } else {
        setFamily(null)
        setStatus('none')
      }
    })
  }, [user, authStatus, isDemo])

  const value = useMemo<FamilyContextValue>(
    () => ({
      status,
      familyId: family?.id ?? null,
      familyName: family?.name ?? null,
      members: family?.members ?? [],
    }),
    [status, family],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}
