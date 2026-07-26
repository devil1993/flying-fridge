import type { Task } from '../tasks/types'
import type { Notice } from '../notices/types'
import type { LostItem } from '../lostfound/types'
import type { PantryItem } from '../pantry/types'
import type { Question } from '../questions/types'
import { isOnBoard } from '../notices/noticeLogic'
import { isSearching } from '../lostfound/lostLogic'
import { isInStock } from '../pantry/pantryLogic'

/**
 * The dashboard agenda: a read-only, cross-module view over the family board.
 * Each active item contributes a single "relevant date" (its own scheduling
 * moment); items with no such date are undated and sink to the bottom of the
 * recent list. See ADR-0015 for the per-type mapping rationale.
 */

export type AgendaType = 'tasks' | 'notices' | 'lostFound' | 'pantry' | 'questions'

/** Fixed display order (also used for stable sorting and calendar dot order). */
export const AGENDA_TYPES: AgendaType[] = [
  'tasks',
  'notices',
  'lostFound',
  'pantry',
  'questions',
]

export interface AgendaItem {
  /** Namespaced (`type:docId`) so ids never collide across collections. */
  id: string
  type: AgendaType
  title: string
  /** Relevant calendar date (ISO yyyy-mm-dd), or null when undated. */
  date: string | null
}

export interface AgendaCollections {
  tasks: Task[]
  notices: Notice[]
  lostItems: LostItem[]
  pantryItems: PantryItem[]
  questions: Question[]
}

const DAY_MS = 86_400_000
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Parse an ISO yyyy-mm-dd as a *local* calendar date (no timezone drift). */
export function parseIsoDate(iso: string): Date | null {
  const m = ISO_RE.exec(iso)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

/** Local calendar date → ISO yyyy-mm-dd. */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Whole-day difference (b − a) between two ISO dates, or null if unparseable. */
export function dayDiff(aIso: string, bIso: string): number | null {
  const a = parseIsoDate(aIso)
  const b = parseIsoDate(bIso)
  if (!a || !b) return null
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS)
}

/** Pantry's relevant date = when it stops being good (madeOn + keepsDays). */
export function pantryExpiryIso(
  item: Pick<PantryItem, 'madeOn' | 'keepsDays'>,
): string | null {
  if (!item.madeOn || item.keepsDays == null) return null
  const made = parseIsoDate(item.madeOn)
  if (!made) return null
  return toIsoDate(new Date(made.getTime() + item.keepsDays * DAY_MS))
}

/**
 * Flatten the active items of every module into one agenda list. "Active" reuses
 * each module's own board predicate so the agenda matches the overview counts.
 */
export function buildAgenda(c: AgendaCollections, now: number): AgendaItem[] {
  const items: AgendaItem[] = []

  for (const task of c.tasks) {
    if (task.status !== 'open' || task.deleted) continue
    items.push({
      id: `tasks:${task.id}`,
      type: 'tasks',
      title: task.description,
      date: task.targetDate ?? null,
    })
  }
  for (const notice of c.notices) {
    if (!isOnBoard(notice, now)) continue
    items.push({
      id: `notices:${notice.id}`,
      type: 'notices',
      title: notice.text,
      date: notice.date ?? null,
    })
  }
  for (const lost of c.lostItems) {
    if (!isSearching(lost)) continue
    items.push({
      id: `lostFound:${lost.id}`,
      type: 'lostFound',
      title: lost.description,
      date: null, // no scheduling date — always undated
    })
  }
  for (const item of c.pantryItems) {
    if (!isInStock(item)) continue
    items.push({
      id: `pantry:${item.id}`,
      type: 'pantry',
      title: item.name,
      date: pantryExpiryIso(item),
    })
  }
  for (const q of c.questions) {
    if (q.status !== 'open') continue
    items.push({
      id: `questions:${q.id}`,
      type: 'questions',
      title: q.text,
      date: null,
    })
  }

  return items
}

export interface RecentGroups {
  /** Dated items before the focus date — past due, shown first (priority). */
  overdue: AgendaItem[]
  /** Dated items from the focus date up to +aheadDays. */
  around: AgendaItem[]
  /** Undated items, kept together for the bottom of the list. */
  undated: AgendaItem[]
}

function byDateThenType(a: AgendaItem, b: AgendaItem): number {
  const da = a.date ?? ''
  const db = b.date ?? ''
  if (da !== db) return da < db ? -1 : 1
  return AGENDA_TYPES.indexOf(a.type) - AGENDA_TYPES.indexOf(b.type)
}

/**
 * Group a focus date's items into: everything overdue (before it — priority,
 * shown on top), what's on/within the next `aheadDays`, and undated (bottom).
 * The window is forward-only: overdue is its own bucket, not part of "around".
 */
export function recentAround(
  items: AgendaItem[],
  focusIso: string,
  aheadDays = 2,
): RecentGroups {
  const overdue: AgendaItem[] = []
  const around: AgendaItem[] = []
  const undated: AgendaItem[] = []
  for (const it of items) {
    if (!it.date) {
      undated.push(it)
      continue
    }
    const diff = dayDiff(focusIso, it.date)
    if (diff === null) continue
    if (diff < 0) overdue.push(it)
    else if (diff <= aheadDays) around.push(it)
  }
  overdue.sort(byDateThenType)
  around.sort(byDateThenType)
  return { overdue, around, undated }
}

/** The distinct types (in display order) that have a dated item on each day. */
export function typesByDay(items: AgendaItem[]): Map<string, AgendaType[]> {
  const sets = new Map<string, Set<AgendaType>>()
  for (const it of items) {
    if (!it.date) continue
    let set = sets.get(it.date)
    if (!set) {
      set = new Set()
      sets.set(it.date, set)
    }
    set.add(it.type)
  }
  const out = new Map<string, AgendaType[]>()
  for (const [iso, set] of sets) {
    out.set(iso, AGENDA_TYPES.filter((t) => set.has(t)))
  }
  return out
}

export interface MonthCell {
  iso: string
  day: number
  /** False for leading/trailing days that belong to the adjacent month. */
  inMonth: boolean
}

/**
 * A 6×7 (42-cell) calendar grid for the given month, weeks starting Sunday.
 * Leading/trailing cells are the adjacent months' days, flagged `inMonth:false`.
 */
export function monthMatrix(year: number, month: number): MonthCell[] {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay() // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset)
  const cells: MonthCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    cells.push({ iso: toIsoDate(d), day: d.getDate(), inMonth: d.getMonth() === month })
  }
  return cells
}
