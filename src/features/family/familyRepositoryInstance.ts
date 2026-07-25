import { isFirebaseConfigured } from '../../lib/firebase'
import type { FamilyRepository } from './repository'
import { InMemoryFamilyRepository } from './repository'
import { firestoreFamilyRepository } from './firestoreFamilyRepository'

export const familyRepository: FamilyRepository = isFirebaseConfigured
  ? firestoreFamilyRepository
  : new InMemoryFamilyRepository()
