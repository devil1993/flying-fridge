import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDb } from '../../lib/firebase'
import type { PantryItem, NewPantryInput, EditPantryInput, PantryStatus, Actor } from './types'
import type { PantryRepository } from './repository'

const COLLECTION = 'pantry'

function toItem(snap: QueryDocumentSnapshot<DocumentData>): PantryItem {
  const d = snap.data({ serverTimestamps: 'estimate' })
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    name: d.name ?? '',
    madeOn: d.madeOn ?? null,
    keepsDays: d.keepsDays ?? null,
    quantity: d.quantity ?? 0,
    status: (d.status as PantryStatus) ?? 'instock',
    createdBy: d.createdBy ?? '',
    createdByName: d.createdByName ?? '',
    createdAt: created,
    updatedAt: updated,
  }
}

export const firestorePantryRepository: PantryRepository = {
  subscribe(familyId, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(q, (qs) =>
      onChange(qs.docs.map(toItem).sort((a, b) => b.createdAt - a.createdAt)),
    )
  },

  async add(familyId, input: NewPantryInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      name: input.name,
      madeOn: input.madeOn ?? null,
      keepsDays: input.keepsDays ?? null,
      quantity: input.quantity ?? 1,
      status: 'instock' satisfies PantryStatus,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async update(itemId, changes: EditPantryInput) {
    await updateDoc(doc(getDb(), COLLECTION, itemId), {
      name: changes.name,
      madeOn: changes.madeOn,
      keepsDays: changes.keepsDays,
      updatedAt: serverTimestamp(),
    })
  },

  async changeQuantity(itemId, delta: number) {
    // Read-modify-write so we can clamp at 0 (increment() can't clamp).
    const ref = doc(getDb(), COLLECTION, itemId)
    const snap = await getDoc(ref)
    const current = (snap.data()?.quantity as number | undefined) ?? 0
    await updateDoc(ref, {
      quantity: Math.max(0, current + delta),
      updatedAt: serverTimestamp(),
    })
  },

  async markConsumed(itemId) {
    await updateDoc(doc(getDb(), COLLECTION, itemId), {
      status: 'consumed' satisfies PantryStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async restore(itemId) {
    await updateDoc(doc(getDb(), COLLECTION, itemId), {
      status: 'instock' satisfies PantryStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async remove(itemId) {
    await deleteDoc(doc(getDb(), COLLECTION, itemId))
  },
}
