/** The board modules that can raise a notification when something is added. */
export type NotificationModule =
  | 'tasks'
  | 'notices'
  | 'lostFound'
  | 'pantry'
  | 'questions'

/**
 * A family-scoped notification: someone added something to a board. The
 * `excerpt` is the author's own words (language-neutral) so every member can
 * see it; the surrounding sentence ("Ana added a task") is localised per viewer.
 */
export interface AppNotification {
  id: string
  familyId: string
  module: NotificationModule
  /** Short, verbatim excerpt of the item the author created. */
  excerpt: string
  actorId: string
  actorName: string
  createdAt: number
}

export interface NewNotificationInput {
  module: NotificationModule
  excerpt: string
}

export interface Actor {
  id: string
  name: string
}
