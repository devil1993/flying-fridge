import type { Notice } from './types'

/** A non-permanent notice stays on the board for this many days. */
export const NOTICE_TTL_DAYS = 30

const DAY_MS = 86_400_000

/** Whether a non-permanent notice has aged out (permanent notices never do). */
export function isExpired(
  notice: Pick<Notice, 'permanent' | 'createdAt'>,
  now: number,
): boolean {
  if (notice.permanent) return false
  return now > notice.createdAt + NOTICE_TTL_DAYS * DAY_MS
}

/** Whether a notice is currently shown on the board (up and not expired). */
export function isOnBoard(
  notice: Pick<Notice, 'status' | 'permanent' | 'createdAt'>,
  now: number,
): boolean {
  return notice.status === 'up' && !isExpired(notice, now)
}

/** Days remaining before a non-permanent notice expires (null if permanent). */
export function daysLeft(
  notice: Pick<Notice, 'permanent' | 'createdAt'>,
  now: number,
): number | null {
  if (notice.permanent) return null
  const remainingMs = notice.createdAt + NOTICE_TTL_DAYS * DAY_MS - now
  return Math.max(0, Math.ceil(remainingMs / DAY_MS))
}
