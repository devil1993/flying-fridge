import {
  addDoc,
  collection,
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
import type { Notice, NewNoticeInput, EditNoticeInput, NoticeStatus, Actor } from './types'
import type { NoticeRepository } from './repository'

const COLLECTION = 'notices'

function toNotice(snap: QueryDocumentSnapshot<DocumentData>): Notice {
  // 'estimate' so a just-added doc (server timestamp still pending) gets a
  // real local time instead of null — otherwise it looks epoch-0 / expired.
  const d = snap.data({ serverTimestamps: 'estimate' })
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    text: d.text ?? '',
    date: d.date ?? null,
    important: d.important ?? false,
    permanent: d.permanent ?? false,
    status: (d.status as NoticeStatus) ?? 'up',
    deleted: d.deleted ?? false,
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
      onChange(
        qs.docs
          .map(toNotice)
          .filter((notice) => !notice.deleted)
          .sort((a, b) => b.createdAt - a.createdAt),
      ),
    )
  },

  async add(familyId, input: NewNoticeInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      text: input.text,
      date: input.date ?? null,
      important: input.important ?? false,
      permanent: input.permanent ?? false,
      status: 'up' satisfies NoticeStatus,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async update(noticeId, changes: EditNoticeInput) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      text: changes.text,
      date: changes.date,
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

  async restore(noticeId) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      status: 'up' satisfies NoticeStatus,
      updatedAt: serverTimestamp(),
    })
  },

  // Soft delete: data is never destroyed, only taken off the board (ADR-0013).
  async remove(noticeId) {
    await updateDoc(doc(getDb(), COLLECTION, noticeId), {
      deleted: true,
      updatedAt: serverTimestamp(),
    })
  },
}
