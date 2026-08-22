import {
  addDoc,
  arrayUnion,
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
import type { Question, Answer, NewQuestionInput, EditQuestionInput, QuestionStatus, Actor } from './types'
import type { QuestionRepository } from './repository'

const COLLECTION = 'questions'

function toQuestion(snap: QueryDocumentSnapshot<DocumentData>): Question {
  const d = snap.data({ serverTimestamps: 'estimate' })
  const created = d.createdAt?.toMillis?.() ?? 0
  const updated = d.updatedAt?.toMillis?.() ?? created
  return {
    id: snap.id,
    familyId: d.familyId ?? '',
    text: d.text ?? '',
    answers: (d.answers as Answer[] | undefined) ?? [],
    status: (d.status as QuestionStatus) ?? 'open',
    createdBy: d.createdBy ?? '',
    createdByName: d.createdByName ?? '',
    createdAt: created,
    updatedAt: updated,
  }
}

export const firestoreQuestionRepository: QuestionRepository = {
  subscribe(familyId, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('familyId', '==', familyId),
    )
    return onSnapshot(q, (qs) =>
      onChange(qs.docs.map(toQuestion).sort((a, b) => b.createdAt - a.createdAt)),
    )
  },

  async add(familyId, input: NewQuestionInput, author: Actor) {
    await addDoc(collection(getDb(), COLLECTION), {
      familyId,
      text: input.text,
      answers: [],
      status: 'open' satisfies QuestionStatus,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async update(questionId, changes: EditQuestionInput) {
    await updateDoc(doc(getDb(), COLLECTION, questionId), {
      text: changes.text,
      updatedAt: serverTimestamp(),
    })
  },

  async addAnswer(questionId, text: string, author: Actor) {
    // Answers are stored as an array; arrayUnion can't hold serverTimestamp, so
    // the answer's time is the client clock.
    const answer: Answer = {
      text,
      byId: author.id,
      byName: author.name,
      at: Date.now(),
    }
    await updateDoc(doc(getDb(), COLLECTION, questionId), {
      answers: arrayUnion(answer),
      updatedAt: serverTimestamp(),
    })
  },

  async close(questionId) {
    await updateDoc(doc(getDb(), COLLECTION, questionId), {
      status: 'closed' satisfies QuestionStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async reopen(questionId) {
    await updateDoc(doc(getDb(), COLLECTION, questionId), {
      status: 'open' satisfies QuestionStatus,
      updatedAt: serverTimestamp(),
    })
  },

  async remove(questionId) {
    await deleteDoc(doc(getDb(), COLLECTION, questionId))
  },
}
