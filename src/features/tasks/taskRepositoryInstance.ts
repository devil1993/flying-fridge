import { isFirebaseConfigured } from '../../lib/firebase'
import type { TaskRepository } from './repository'
import { InMemoryTaskRepository } from './repository'
import { firestoreTaskRepository } from './firestoreTaskRepository'

/**
 * The repository the app uses: Firestore when configured, otherwise an
 * in-memory store so the dashboard is still usable/demoable without a backend.
 * Tests inject their own instance for isolation.
 */
export const taskRepository: TaskRepository = isFirebaseConfigured
  ? firestoreTaskRepository
  : new InMemoryTaskRepository()
