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
import type { LostItem, NewLostInput, LostStatus, Actor } from './types'
import type { LostRepository } from './repository'

const COLLECTION = 'lostAndFound'

function toItem(snap: QueryDocumentSnapshot<DocumentData>): LostItem {
  const d = snap.data({ serverTimestamps: 'estimate' })
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    description: d.description ?? '',
    status: (d.status as LostStatus) ?? 'searching',
    createdBy: d.createdBy ?? '',
    createdByName: d.createdByName ?? '',
    createdAt: created,
    updatedAt: updated,
  }
}

export const firestoreLostRepository: LostRepository = {
  subscribe(familyId, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(q, (qs) =>
      onChange(qs.docs.map(toItem).sort((a, b) => b.createdAt - a.createdAt)),
    )
  },

  async add(familyId, input: NewLostInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      description: input.description,
      status: 'searching' satisfies LostStatus,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async markFound(itemId) {
    await updateDoc(doc(getDb(), COLLECTION, itemId), {
      status: 'found' satisfies LostStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async takeDown(itemId) {
    await updateDoc(doc(getDb(), COLLECTION, itemId), {
      status: 'down' satisfies LostStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async remove(itemId) {
    await deleteDoc(doc(getDb(), COLLECTION, itemId))
  },
}
