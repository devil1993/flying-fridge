import {
  isSupported,
  getAnalytics,
  logEvent,
  type Analytics,
} from 'firebase/analytics'
import { getFirebaseApp, isFirebaseConfigured } from './config'

let cached: Analytics | null = null
let resolved = false

async function getAnalyticsIfSupported(): Promise<Analytics | null> {
  if (resolved) return cached
  resolved = true
  try {
    if (isFirebaseConfigured && (await isSupported())) {
      cached = getAnalytics(getFirebaseApp())
    }
  } catch {
    cached = null
  }
  return cached
}

/**
 * Fire-and-forget telemetry event via Firebase Analytics (uses the project's
 * measurementId). No-op when Firebase/Analytics isn't available, so it's safe
 * to call unconditionally.
 */
export async function track(
  event: string,
  params?: Record<string, unknown>,
): Promise<void> {
  const analytics = await getAnalyticsIfSupported()
  if (analytics) logEvent(analytics, event, params)
}
