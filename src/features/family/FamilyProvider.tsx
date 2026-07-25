import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { FamilyContext, type FamilyContextValue } from './familyContext'

const ID_KEY = 'ff-familyId'
const NAME_KEY = 'ff-familyName'

/** Minimal family identity for the Tasks slice: a shared code everyone types
 *  in. Real membership + Firestore-backed families come with a later step. */
function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [familyId, setFamilyId] = useState<string | null>(() =>
    localStorage.getItem(ID_KEY),
  )
  const [familyName, setFamilyName] = useState<string | null>(() =>
    localStorage.getItem(NAME_KEY),
  )

  const join = useCallback((name: string) => {
    const id = slugify(name)
    if (!id) return
    const trimmed = name.trim()
    localStorage.setItem(ID_KEY, id)
    localStorage.setItem(NAME_KEY, trimmed)
    setFamilyId(id)
    setFamilyName(trimmed)
  }, [])

  const leave = useCallback(() => {
    localStorage.removeItem(ID_KEY)
    localStorage.removeItem(NAME_KEY)
    setFamilyId(null)
    setFamilyName(null)
  }, [])

  const value = useMemo<FamilyContextValue>(
    () => ({ familyId, familyName, join, leave }),
    [familyId, familyName, join, leave],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}
