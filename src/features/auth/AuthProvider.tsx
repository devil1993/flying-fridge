import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  observeAuth,
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOutUser,
  type AppUser,
} from '../../lib/firebase'
import { AuthContext, type AuthStatus, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    return observeAuth((u) => {
      setUser(u)
      setStatus(u ? 'authenticated' : 'unauthenticated')
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signInEmail: signInWithEmail,
      registerEmail: registerWithEmail,
      signInGoogle: signInWithGoogle,
      signOut: signOutUser,
    }),
    [user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
