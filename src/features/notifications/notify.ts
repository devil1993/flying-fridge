import { track } from '../../lib/firebase'
import { notificationRepository } from './notificationRepositoryInstance'
import type { NotificationModule, Actor } from './types'

/** Excerpts are kept short so the feed stays scannable. */
const EXCERPT_MAX = 140

/**
 * Publish a "something was added" notification to the family feed. Called from
 * each board's add action (fire-and-forget); every other member picks it up in
 * real time via the notifications subscription. No-op without a family.
 */
export function notifyItemAdded(
  familyId: string | null,
  module: NotificationModule,
  excerpt: string,
  actor: Actor,
): void {
  if (!familyId) return
  const trimmed = excerpt.trim().slice(0, EXCERPT_MAX)
  void notificationRepository.add(familyId, { module, excerpt: trimmed }, actor)
  void track('notification_publish', { module })
}
