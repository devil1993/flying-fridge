import { createContext, useContext } from 'react'

export interface FamilyMember {
  uid: string
  name: string
  email: string | null
}

export interface Family {
  id: string
  name: string
  memberUids: string[]
  members: FamilyMember[]
}

export type FamilyStatus = 'loading' | 'none' | 'ready'

export interface FamilyContextValue {
  status: FamilyStatus
  familyId: string | null
  familyName: string | null
  members: FamilyMember[]
}

export const FamilyContext = createContext<FamilyContextValue | null>(null)

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within <FamilyProvider>')
  return ctx
}
