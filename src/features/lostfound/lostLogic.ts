import type { LostItem } from './types'

const DAY_MS = 86_400_000

/** On the board while still being searched for. */
export function isSearching(item: Pick<LostItem, 'status'>): boolean {
  return item.status === 'searching'
}

/** Whole days since the item was posted (for the "posted N days ago" line). */
export function daysSince(createdAt: number, now: number): number {
  return Math.max(0, Math.floor((now - createdAt) / DAY_MS))
}
