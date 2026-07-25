import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationRepository } from './notificationRepositoryInstance'
import type { AppNotification } from './types'

function lastSeenKey(familyId: string, uid: string): string {
  return `ff.notif.lastSeen.${familyId}.${uid}`
}

function readLastSeen(familyId: string, uid: string): number {
  try {
    const raw = localStorage.getItem(lastSeenKey(familyId, uid))
    return raw ? Number(raw) || 0 : 0
  } catch {
    return 0
  }
}

export interface NotificationsState {
  items: AppNotification[]
  unreadCount: number
  /** Timestamp up to which this user has seen the feed. */
  lastSeen: number
  markAllRead: () => void
}

/**
 * Subscribes a member to the family notification feed and tracks per-user read
 * state locally (a last-seen timestamp in localStorage — no extra writes, no
 * cross-member contention). Unread = added by someone else, after last-seen.
 *
 * `onIncoming` fires once per genuinely new notification from another member
 * (after the initial hydration), letting the caller surface an OS notification
 * while the tab is alive but unfocused. It is read from a ref so a changing
 * callback identity never forces a resubscribe.
 */
export function useNotifications(
  familyId: string | null,
  meId: string,
  onIncoming?: (n: AppNotification) => void,
): NotificationsState {
  const [items, setItems] = useState<AppNotification[]>([])
  const [lastSeen, setLastSeen] = useState(0)
  const onIncomingRef = useRef(onIncoming)
  onIncomingRef.current = onIncoming

  useEffect(() => {
    if (!familyId) {
      setItems([])
      setLastSeen(0)
      return
    }
    setLastSeen(readLastSeen(familyId, meId))
    const known = new Set<string>()
    let hydrated = false
    return notificationRepository.subscribe(familyId, (next) => {
      if (hydrated) {
        for (const n of next) {
          if (!known.has(n.id) && n.actorId !== meId) {
            onIncomingRef.current?.(n)
          }
        }
      }
      known.clear()
      for (const n of next) known.add(n.id)
      hydrated = true
      setItems(next)
    })
  }, [familyId, meId])

  const unreadCount = items.filter(
    (n) => n.actorId !== meId && n.createdAt > lastSeen,
  ).length

  const markAllRead = useCallback(() => {
    if (!familyId) return
    const max = items.reduce((m, n) => Math.max(m, n.createdAt), lastSeen)
    try {
      localStorage.setItem(lastSeenKey(familyId, meId), String(max))
    } catch {
      /* storage unavailable — read state is best-effort */
    }
    setLastSeen(max)
  }, [familyId, meId, items, lastSeen])

  return { items, unreadCount, lastSeen, markAllRead }
}
