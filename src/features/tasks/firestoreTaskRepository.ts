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
import type { Task, NewTaskInput, TaskStatus, Actor } from './types'
import type { TaskRepository } from './repository'

const COLLECTION = 'tasks'

function toTask(snap: QueryDocumentSnapshot<DocumentData>): Task {
  const d = snap.data()
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    description: d.description ?? '',
    targetDate: d.targetDate ?? null,
    assigneeId: d.assigneeId ?? null,
    assigneeName: d.assigneeName ?? null,
    status: (d.status as TaskStatus) ?? 'open',
    createdBy: d.createdBy ?? '',
    createdAt: created,
    updatedAt: updated,
  }
}

/**
 * Firestore-backed TaskRepository. Family-scoped queries; real-time via
 * onSnapshot. Requires Firebase to be configured (getDb throws otherwise).
 * Security Rules — enforcing family membership — are the real access boundary
 * (see docs/design/architecture.md); this client scoping is convenience.
 */
export const firestoreTaskRepository: TaskRepository = {
  subscribe(familyId, onChange) {
    // Filter by family server-side; sort newest-first on the client so a single
    // equality filter is enough (no composite index needed).
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(q, (qs) =>
      onChange(qs.docs.map(toTask).sort((a, b) => b.createdAt - a.createdAt)),
    )
  },

  async add(familyId, input: NewTaskInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      description: input.description,
      targetDate: input.targetDate ?? null,
      assigneeId: null,
      assigneeName: null,
      status: 'open' satisfies TaskStatus,
      createdBy: author.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async assign(taskId, user: Actor | null) {
    await updateDoc(doc(getDb(), COLLECTION, taskId), {
      assigneeId: user?.id ?? null,
      assigneeName: user?.name ?? null,
      updatedAt: serverTimestamp(),
    })
  },

  async setStatus(taskId, status: TaskStatus) {
    await updateDoc(doc(getDb(), COLLECTION, taskId), {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  async remove(taskId) {
    await deleteDoc(doc(getDb(), COLLECTION, taskId))
  },
}
