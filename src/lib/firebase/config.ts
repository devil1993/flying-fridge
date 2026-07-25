import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

/**
 * Whether the Firebase web config is present. The project is created manually
 * by a human — see human-instructions/01-firebase-project-setup.md. Until then
 * the app still runs (the landing page needs no backend); anything that touches
 * Firebase should check this first.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let app: FirebaseApp | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env.local and fill in the ' +
        'VITE_FIREBASE_* values (see human-instructions/01-firebase-project-setup.md).',
    )
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  }
  return app
}

export const getAuthClient = (): Auth => getAuth(getFirebaseApp())
export const getDb = (): Firestore => getFirestore(getFirebaseApp())
