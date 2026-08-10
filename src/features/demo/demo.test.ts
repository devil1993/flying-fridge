import { activateDemo, deactivateDemo } from './demoRepositories'
import { DEMO_FAMILY_ID, DEMO_USER } from './demoData'
import { taskRepository } from '../tasks/taskRepositoryInstance'
import { notificationRepository } from '../notifications/notificationRepositoryInstance'
import type { Task } from '../tasks/types'
import type { AppNotification } from '../notifications/types'

describe('demo mode', () => {
  afterEach(() => deactivateDemo())

  it('seeds every board with the sample family data', () => {
    activateDemo()
    let tasks: Task[] = []
    const unsub = taskRepository.subscribe(DEMO_FAMILY_ID, (t) => (tasks = t))
    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks.some((t) => t.description.includes('rui fish'))).toBe(true)
    // The visitor (Rima) has tasks assigned to her.
    expect(tasks.some((t) => t.assigneeId === DEMO_USER.id)).toBe(true)
    unsub()
  })

  it('seeds notifications from other members (so the guest has unread)', () => {
    activateDemo()
    let items: AppNotification[] = []
    const unsub = notificationRepository.subscribe(DEMO_FAMILY_ID, (n) => (items = n))
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((n) => n.actorId !== DEMO_USER.id)).toBe(true)
    unsub()
  })

  it('restores the real repositories on exit — no demo data leaks', () => {
    activateDemo()
    deactivateDemo()
    let tasks: Task[] = []
    const unsub = taskRepository.subscribe(DEMO_FAMILY_ID, (t) => (tasks = t))
    expect(tasks).toHaveLength(0) // real in-memory repo is empty in tests
    unsub()
  })
})
