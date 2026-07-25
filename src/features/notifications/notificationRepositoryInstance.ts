import { isFirebaseConfigured } from '../../lib/firebase'
import type { NotificationRepository } from './repository'
import { InMemoryNotificationRepository } from './repository'
import { firestoreNotificationRepository } from './firestoreNotificationRepository'

export const notificationRepository: NotificationRepository = isFirebaseConfigured
  ? firestoreNotificationRepository
  : new InMemoryNotificationRepository()
