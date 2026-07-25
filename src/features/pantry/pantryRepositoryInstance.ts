import { isFirebaseConfigured } from '../../lib/firebase'
import type { PantryRepository } from './repository'
import { InMemoryPantryRepository } from './repository'
import { firestorePantryRepository } from './firestorePantryRepository'

export const pantryRepository: PantryRepository = isFirebaseConfigured
  ? firestorePantryRepository
  : new InMemoryPantryRepository()
