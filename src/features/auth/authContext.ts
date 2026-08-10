import { createContext, useContext } from 'react'
import type { AppUser } from '../../lib/firebase'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  user: AppUser | null
  status: AuthStatus
  signInEmail: (email: string, password: string) => Promise<void>
  registerEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  signOut: () => Promise<void>
  /** True while exploring the ephemeral demo (seeded, in-memory, never saved). */
  isDemo?: boolean
  /** When the demo auto-ends (epoch ms), or null. */
  demoEndsAt?: number | null
  /** Enter demo mode as a guest of the sample family. */
  startDemo?: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
