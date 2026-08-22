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
import type { Task, NewTaskInput, EditTaskInput, TaskStatus, Actor } from './types'
import type { TaskRepository } from './repository'

const COLLECTION = 'tasks'

function toTask(snap: QueryDocumentSnapshot<DocumentData>): Task {
  // 'estimate' so a just-added doc (server timestamp still pending) sorts with a
  // real local time instead of null.
  const d = snap.data({ serverTimestamps: 'estimate' })
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
    deleted: d.deleted ?? false,
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
      onChange(
        qs.docs
          .map(toTask)
          .filter((task) => !task.deleted)
          .sort((a, b) => b.createdAt - a.createdAt),
      ),
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

  async update(taskId, changes: EditTaskInput) {
    await updateDoc(doc(getDb(), COLLECTION, taskId), {
      description: changes.description,
      targetDate: changes.targetDate,
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

  // Soft delete: data is never destroyed, only taken off the board (see
  // ADR-0013). Reads filter out `deleted` items.
  async remove(taskId) {
    await updateDoc(doc(getDb(), COLLECTION, taskId), {
      deleted: true,
      updatedAt: serverTimestamp(),
    })
  },
}
