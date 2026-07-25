import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDb } from '../../lib/firebase'
import type { Notice, NewNoticeInput, NoticeStatus, Actor } from './types'
import type { NoticeRepository } from './repository'

const COLLECTION = 'notices'

function toNotice(snap: QueryDocumentSnapshot<DocumentData>): Notice {
  const d = snap.data()
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    text: d.text ?? '',
    important: d.important ?? false,
    permanent: d.permanent ?? false,
    status: (d.status as NoticeStatus) ?? 'up',
    createdBy: d.createdBy ?? '',
    createdByName: d.createdByName ?? '',
    createdAt: created,
    updatedAt: updated,
  }
}

/** Firestore-backed NoticeRepository. Family-scoped, real-time, timelined. */
export const firestoreNoticeRepository: NoticeRepository = {
  subscribe(familyId, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(q, (qs) =>
      onChange(qs.docs.map(toNotice).sort((a, b) => b.createdAt - a.createdAt)),
    )
  },

  async add(familyId, input: NewNoticeInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      text: input.text,
      important: input.important ?? false,
      permanent: input.permanent ?? false,
      status: 'up' satisfies NoticeStatus,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async setImportant(noticeId, important: boolean) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      important,
      updatedAt: serverTimestamp(),
    })
  },

  async setPermanent(noticeId, permanent: boolean) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      permanent,
      updatedAt: serverTimestamp(),
    })
  },

  async takeDown(noticeId) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      status: 'down' satisfies NoticeStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async remove(noticeId) {
    await deleteDoc(doc(getDb(), COLLECTION, noticeId))
  },
}
