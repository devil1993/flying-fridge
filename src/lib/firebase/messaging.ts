import {
  isSupported,
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from 'firebase/messaging'
import { getFirebaseApp, isFirebaseConfigured } from './config'

/**
 * Returns a Messaging instance only when Firebase is configured AND the browser
 * supports the Push API / service workers (Safari < 16.4, some in-app browsers
 * do not). Returns null otherwise so callers can degrade gracefully.
 */
export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (!isFirebaseConfigured) return null
  if (!(await isSupported())) return null
  return getMessaging(getFirebaseApp())
}

/**
 * Asks the user for notification permission and, if granted, returns the FCM
 * registration token. Requires VITE_FIREBASE_VAPID_KEY. Background delivery
 * additionally needs public/firebase-messaging-sw.js (wired in a later step —
 * see docs/design/pwa-and-notifications.md).
 */
export async function requestNotificationToken(): Promise<string | null> {
  const messaging = await getMessagingIfSupported()
  if (!messaging) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
  return getToken(messaging, vapidKey ? { vapidKey } : undefined)
}

export { onMessage }
