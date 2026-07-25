import type { PantryItem } from './types'

const DAY_MS = 86_400_000

/** On the list until consumed. */
export function isInStock(item: Pick<PantryItem, 'status'>): boolean {
  return item.status === 'instock'
}

/**
 * Days until the item is past its likely-good window (madeOn + keepsDays).
 * Negative when already past. null when made-date or shelf life is unknown.
 */
export function freshnessDaysLeft(
  item: Pick<PantryItem, 'madeOn' | 'keepsDays'>,
  now: number,
): number | null {
  if (!item.madeOn || item.keepsDays == null) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(item.madeOn)
  if (!m) return null
  const made = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime()
  const expiry = made + item.keepsDays * DAY_MS
  return Math.ceil((expiry - now) / DAY_MS)
}
