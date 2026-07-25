import { createContext, useContext } from 'react'

export interface FamilyContextValue {
  familyId: string | null
  familyName: string | null
  join: (name: string) => void
  leave: () => void
}

export const FamilyContext = createContext<FamilyContextValue | null>(null)

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within <FamilyProvider>')
  return ctx
}
