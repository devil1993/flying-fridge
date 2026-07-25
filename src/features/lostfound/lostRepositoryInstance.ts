import { isFirebaseConfigured } from '../../lib/firebase'
import type { LostRepository } from './repository'
import { InMemoryLostRepository } from './repository'
import { firestoreLostRepository } from './firestoreLostRepository'

export const lostRepository: LostRepository = isFirebaseConfigured
  ? firestoreLostRepository
  : new InMemoryLostRepository()
