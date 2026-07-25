import {
  taskUrgency,
  isClaimable,
  isAssignedTo,
  partitionForUser,
  SOON_WINDOW_DAYS,
} from './taskLogic'
import type { Task } from './types'

const NOW = new Date(2026, 6, 25) // 2026-07-25 (local)

function isoOffset(days: number): string {
  const d = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    familyId: 'fam',
    description: 'Do a thing',
    targetDate: null,
    assigneeId: null,
    assigneeName: null,
    status: 'open',
    createdBy: 'u1',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

describe('taskUrgency', () => {
  it('is none without a target date or when done', () => {
    expect(taskUrgency(makeTask({ targetDate: null }), NOW)).toBe('none')
    expect(
      taskUrgency(makeTask({ targetDate: isoOffset(1), status: 'done' }), NOW),
    ).toBe('none')
  })

  it('buckets by days from today', () => {
    expect(taskUrgency(makeTask({ targetDate: isoOffset(-1) }), NOW)).toBe('overdue')
    expect(taskUrgency(makeTask({ targetDate: isoOffset(0) }), NOW)).toBe('today')
    expect(taskUrgency(makeTask({ targetDate: isoOffset(1) }), NOW)).toBe('soon')
    expect(
      taskUrgency(makeTask({ targetDate: isoOffset(SOON_WINDOW_DAYS) }), NOW),
    ).toBe('soon')
    expect(
      taskUrgency(makeTask({ targetDate: isoOffset(SOON_WINDOW_DAYS + 1) }), NOW),
    ).toBe('later')
  })

  it('treats a malformed date as none rather than throwing', () => {
    expect(taskUrgency(makeTask({ targetDate: 'not-a-date' }), NOW)).toBe('none')
  })
})

describe('assignment helpers', () => {
  it('is claimable only when open and unassigned', () => {
    expect(isClaimable(makeTask())).toBe(true)
    expect(isClaimable(makeTask({ assigneeId: 'u2' }))).toBe(false)
    expect(isClaimable(makeTask({ status: 'done' }))).toBe(false)
  })

  it('detects the assignee', () => {
    expect(isAssignedTo(makeTask({ assigneeId: 'u2' }), 'u2')).toBe(true)
    expect(isAssignedTo(makeTask({ assigneeId: 'u2' }), 'u1')).toBe(false)
  })
})

describe('partitionForUser', () => {
  it("splits the user's open claimed tasks from the rest", () => {
    const tasks = [
      makeTask({ id: 'a', assigneeId: 'me' }),
      makeTask({ id: 'b', assigneeId: 'other' }),
      makeTask({ id: 'c', assigneeId: null }),
      makeTask({ id: 'd', assigneeId: 'me', status: 'done' }),
    ]
    const { mine, board } = partitionForUser(tasks, 'me')
    expect(mine.map((t) => t.id)).toEqual(['a'])
    expect(board.map((t) => t.id)).toEqual(['b', 'c', 'd'])
  })
})
