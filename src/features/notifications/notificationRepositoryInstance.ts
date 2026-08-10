import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { NotificationRepository } from './repository'
import { InMemoryNotificationRepository } from './repository'
import { firestoreNotificationRepository } from './firestoreNotificationRepository'

const real: NotificationRepository = isFirebaseConfigured
  ? firestoreNotificationRepository
  : new InMemoryNotificationRepository()
const s = switchable<NotificationRepository>(real)

export const notificationRepository = s.proxy
export const setNotificationRepository = s.set
