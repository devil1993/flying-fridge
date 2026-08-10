import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { NoticeRepository } from './repository'
import { InMemoryNoticeRepository } from './repository'
import { firestoreNoticeRepository } from './firestoreNoticeRepository'

const real: NoticeRepository = isFirebaseConfigured
  ? firestoreNoticeRepository
  : new InMemoryNoticeRepository()
const s = switchable<NoticeRepository>(real)

export const noticeRepository = s.proxy
export const setNoticeRepository = s.set
