import { InMemoryTaskRepository } from '../tasks/repository'
import { setTaskRepository } from '../tasks/taskRepositoryInstance'
import { InMemoryNoticeRepository } from '../notices/repository'
import { setNoticeRepository } from '../notices/noticeRepositoryInstance'
import { InMemoryLostRepository } from '../lostfound/repository'
import { setLostRepository } from '../lostfound/lostRepositoryInstance'
import { InMemoryPantryRepository } from '../pantry/repository'
import { setPantryRepository } from '../pantry/pantryRepositoryInstance'
import { InMemoryQuestionRepository } from '../questions/repository'
import { setQuestionRepository } from '../questions/questionRepositoryInstance'
import { InMemoryNotificationRepository } from '../notifications/repository'
import { setNotificationRepository } from '../notifications/notificationRepositoryInstance'
import { buildDemoData } from './demoData'

let active = false

/**
 * Point every board's repository at fresh, seeded in-memory stores. Demo data
 * never touches Firebase — reads and writes stay local, so "auto-delete after
 * 30 min" is inherent (nothing was persisted). Idempotent.
 */
export function activateDemo(): void {
  const data = buildDemoData()

  const tasks = new InMemoryTaskRepository()
  tasks.seed(data.tasks)
  setTaskRepository(tasks)

  const notices = new InMemoryNoticeRepository()
  notices.seed(data.notices)
  setNoticeRepository(notices)

  const lost = new InMemoryLostRepository()
  lost.seed(data.lost)
  setLostRepository(lost)

  const pantry = new InMemoryPantryRepository()
  pantry.seed(data.pantry)
  setPantryRepository(pantry)

  const questions = new InMemoryQuestionRepository()
  questions.seed(data.questions)
  setQuestionRepository(questions)

  const notifications = new InMemoryNotificationRepository()
  notifications.seed(data.notifications)
  setNotificationRepository(notifications)

  active = true
}

/** Restore the real repositories and drop the demo stores (garbage-collected). */
export function deactivateDemo(): void {
  if (!active) return
  setTaskRepository(null)
  setNoticeRepository(null)
  setLostRepository(null)
  setPantryRepository(null)
  setQuestionRepository(null)
  setNotificationRepository(null)
  active = false
}
