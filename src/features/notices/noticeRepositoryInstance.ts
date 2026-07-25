import { isFirebaseConfigured } from '../../lib/firebase'
import type { NoticeRepository } from './repository'
import { InMemoryNoticeRepository } from './repository'
import { firestoreNoticeRepository } from './firestoreNoticeRepository'

export const noticeRepository: NoticeRepository = isFirebaseConfigured
  ? firestoreNoticeRepository
  : new InMemoryNoticeRepository()
