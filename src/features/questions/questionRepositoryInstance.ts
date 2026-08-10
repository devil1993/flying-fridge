import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { QuestionRepository } from './repository'
import { InMemoryQuestionRepository } from './repository'
import { firestoreQuestionRepository } from './firestoreQuestionRepository'

const real: QuestionRepository = isFirebaseConfigured
  ? firestoreQuestionRepository
  : new InMemoryQuestionRepository()
const s = switchable<QuestionRepository>(real)

export const questionRepository = s.proxy
export const setQuestionRepository = s.set
