import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { PantryRepository } from './repository'
import { InMemoryPantryRepository } from './repository'
import { firestorePantryRepository } from './firestorePantryRepository'

const real: PantryRepository = isFirebaseConfigured
  ? firestorePantryRepository
  : new InMemoryPantryRepository()
const s = switchable<PantryRepository>(real)

export const pantryRepository = s.proxy
export const setPantryRepository = s.set
