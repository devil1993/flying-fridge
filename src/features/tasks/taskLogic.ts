import type { Task } from './types'

/**
 * Target-date urgency buckets used to colour-code tasks on the dashboard.
 * Done tasks and tasks with no target date are 'none'.
 */
export type Urgency = 'none' | 'overdue' | 'today' | 'soon' | 'later'

/** Number of days (inclusive of today) within which a task counts as 'soon'. */
export const SOON_WINDOW_DAYS = 3

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Parse an ISO yyyy-mm-dd as a local calendar date (no timezone drift). */
function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function taskUrgency(
  task: Pick<Task, 'targetDate' | 'status'>,
  now: Date,
): Urgency {
  if (task.status === 'done' || !task.targetDate) return 'none'
  const target = parseIsoDate(task.targetDate)
  if (!target) return 'none'
  const diffDays = Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000)
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= SOON_WINDOW_DAYS) return 'soon'
  return 'later'
}

/** True when the task is open and unclaimed, so someone may assign it to self. */
export function isClaimable(task: Pick<Task, 'status' | 'assigneeId'>): boolean {
  return task.status === 'open' && task.assigneeId == null
}

export function isAssignedTo(
  task: Pick<Task, 'assigneeId'>,
  userId: string,
): boolean {
  return task.assigneeId === userId
}

/** Split a list into the given user's claimed tasks and the rest (open board). */
export function partitionForUser(
  tasks: Task[],
  userId: string,
): { mine: Task[]; board: Task[] } {
  const mine: Task[] = []
  const board: Task[] = []
  for (const t of tasks) {
    if (t.status === 'open' && t.assigneeId === userId) mine.push(t)
    else board.push(t)
  }
  return { mine, board }
}
