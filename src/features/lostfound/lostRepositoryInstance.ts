import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { LostRepository } from './repository'
import { InMemoryLostRepository } from './repository'
import { firestoreLostRepository } from './firestoreLostRepository'

const real: LostRepository = isFirebaseConfigured
  ? firestoreLostRepository
  : new InMemoryLostRepository()
const s = switchable<LostRepository>(real)

export const lostRepository = s.proxy
export const setLostRepository = s.set
