import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { getAuthClient, isFirebaseConfigured } from './config'

/** App-facing user shape (decoupled from the Firebase User type). */
export interface AppUser {
  id: string
  name: string
  email: string | null
}

function toAppUser(u: User): AppUser {
  const fallback = u.email ? u.email.split('@')[0] : 'Member'
  return { id: u.uid, name: u.displayName ?? fallback, email: u.email }
}

/**
 * Subscribe to auth state. When Firebase isn't configured, reports "signed out"
 * once and does nothing else, so the app still runs (landing/guide) without a
 * backend. Returns an unsubscribe function.
 */
export function observeAuth(onChange: (user: AppUser | null) => void): () => void {
  if (!isFirebaseConfigured) {
    onChange(null)
    return () => {}
  }
  return onAuthStateChanged(getAuthClient(), (u) =>
    onChange(u ? toAppUser(u) : null),
  )
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getAuthClient(), email, password)
}

export async function registerWithEmail(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(getAuthClient(), email, password)
}

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(getAuthClient(), new GoogleAuthProvider())
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(getAuthClient())
}
