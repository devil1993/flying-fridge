import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  observeAuth,
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOutUser,
  track,
  type AppUser,
} from '../../lib/firebase'
import { activateDemo, deactivateDemo } from '../demo/demoRepositories'
import { DEMO_USER } from '../demo/demoData'
import { AuthContext, type AuthStatus, type AuthContextValue } from './authContext'

/** The demo auto-ends after this long, wiping the in-memory sample data. */
const DEMO_DURATION_MS = 30 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [demoEndsAt, setDemoEndsAt] = useState<number | null>(null)

  // Read from inside the observeAuth callback without re-subscribing.
  const demoRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return observeAuth((u) => {
      // Ignore real auth changes while in demo mode.
      if (demoRef.current) return
      setUser(u)
      setStatus(u ? 'authenticated' : 'unauthenticated')
    })
  }, [])

  const endDemo = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    deactivateDemo()
    demoRef.current = false
    setDemoEndsAt(null)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const startDemo = useCallback(() => {
    activateDemo()
    demoRef.current = true
    setUser(DEMO_USER)
    setStatus('authenticated')
    setDemoEndsAt(Date.now() + DEMO_DURATION_MS)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(endDemo, DEMO_DURATION_MS)
    void track('demo_start')
  }, [endDemo])

  const signOut = useCallback(async () => {
    if (demoRef.current) {
      endDemo()
      return
    }
    await signOutUser()
  }, [endDemo])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signInEmail: signInWithEmail,
      registerEmail: registerWithEmail,
      signInGoogle: signInWithGoogle,
      signOut,
      isDemo: demoEndsAt !== null,
      demoEndsAt,
      startDemo,
    }),
    [user, status, demoEndsAt, signOut, startDemo],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
