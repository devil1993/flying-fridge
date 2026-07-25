import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDb } from '../../lib/firebase'
import type { AppNotification, NewNotificationInput, Actor } from './types'
import type { NotificationRepository } from './repository'
import { NOTIFICATION_FEED_LIMIT } from './repository'

const COLLECTION = 'notifications'

function toNotification(snap: QueryDocumentSnapshot<DocumentData>): AppNotification {
  // 'estimate' so a just-written doc (server timestamp still pending) sorts with
  // a real local time instead of epoch-0.
  const d = snap.data({ serverTimestamps: 'estimate' })
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    module: d.module ?? 'notices',
    excerpt: d.excerpt ?? '',
    actorId: d.actorId ?? '',
    actorName: d.actorName ?? '',
    createdAt: d.createdAt?.toMillis?.() ?? 0,
  }
}

/**
 * Firestore-backed NotificationRepository. A single family-scoped feed that
 * every member subscribes to for real-time in-app alerts. Sorted newest-first
 * on the client (one equality filter → no composite index) and capped to the
 * most recent NOTIFICATION_FEED_LIMIT.
 */
export const firestoreNotificationRepository: NotificationRepository = {
  subscribe(familyId, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(
      q,
      (qs) =>
        onChange(
          qs.docs
            .map(toNotification)
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, NOTIFICATION_FEED_LIMIT),
        ),
      (err) =>
        console.error(
          '[notifications] could not read the feed — check firestore.rules is published:',
          err,
        ),
    )
  },

  async add(familyId, input: NewNotificationInput, actor: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      module: input.module,
      excerpt: input.excerpt,
      actorId: actor.id,
      actorName: actor.name,
      createdAt: serverTimestamp(),
    })
  },
}
