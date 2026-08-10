import type { AppNotification, NewNotificationInput, Actor } from './types'

/** How many recent notifications a client keeps in view. */
export const NOTIFICATION_FEED_LIMIT = 10

export interface NotificationRepository {
  /** Subscribe to a family's notifications (newest first). */
  subscribe(
    familyId: string,
    onChange: (items: AppNotification[]) => void,
  ): () => void
  add(
    familyId: string,
    input: NewNotificationInput,
    actor: Actor,
  ): Promise<void>
}

/** In-memory NotificationRepository for tests and offline development. */
export class InMemoryNotificationRepository implements NotificationRepository {
  private items = new Map<string, AppNotification>()
  private listeners = new Set<(items: AppNotification[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): AppNotification[] {
    return [...this.items.values()]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, NOTIFICATION_FEED_LIMIT)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  /** Bulk-load fully-formed records (used to seed demo mode). */
  seed(items: AppNotification[]): void {
    for (const it of items) this.items.set(it.id, it)
    this.emit()
  }

  subscribe(
    familyId: string,
    onChange: (items: AppNotification[]) => void,
  ): () => void {
    const listener = (items: AppNotification[]) =>
      onChange(items.filter((n) => n.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(
    familyId: string,
    input: NewNotificationInput,
    actor: Actor,
  ): Promise<void> {
    const id = `notif-${++this.seq}`
    this.items.set(id, {
      id,
      familyId,
      module: input.module,
      excerpt: input.excerpt,
      actorId: actor.id,
      actorName: actor.name,
      createdAt: this.now(),
    })
    this.emit()
    return Promise.resolve()
  }
}
