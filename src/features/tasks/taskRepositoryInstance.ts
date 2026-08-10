import { isFirebaseConfigured } from '../../lib/firebase'
import { switchable } from '../app/switchableRepository'
import type { TaskRepository } from './repository'
import { InMemoryTaskRepository } from './repository'
import { firestoreTaskRepository } from './firestoreTaskRepository'

/**
 * The repository the app uses: Firestore when configured, otherwise an
 * in-memory store so the dashboard is still usable/demoable without a backend.
 * Wrapped in a swappable proxy so demo mode can point it at seeded in-memory
 * data. Tests inject their own instance for isolation.
 */
const real: TaskRepository = isFirebaseConfigured
  ? firestoreTaskRepository
  : new InMemoryTaskRepository()
const s = switchable<TaskRepository>(real)

export const taskRepository = s.proxy
export const setTaskRepository = s.set
