import { isFirebaseConfigured } from '../../lib/firebase'
import type { QuestionRepository } from './repository'
import { InMemoryQuestionRepository } from './repository'
import { firestoreQuestionRepository } from './firestoreQuestionRepository'

export const questionRepository: QuestionRepository = isFirebaseConfigured
  ? firestoreQuestionRepository
  : new InMemoryQuestionRepository()
