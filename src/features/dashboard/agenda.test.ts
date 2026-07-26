import {
  buildAgenda,
  recentAround,
  typesByDay,
  monthMatrix,
  pantryExpiryIso,
  toIsoDate,
  dayDiff,
  type AgendaCollections,
  type AgendaItem,
} from './agenda'
import type { Task } from '../tasks/types'
import type { Notice } from '../notices/types'
import type { LostItem } from '../lostfound/types'
import type { PantryItem } from '../pantry/types'
import type { Question } from '../questions/types'

const NOW = new Date(2026, 6, 26).getTime() // 2026-07-26 local

function task(p: Partial<Task>): Task {
  return {
    id: 'x',
    familyId: 'fam',
    description: 'A task',
    targetDate: null,
    assigneeId: null,
    assigneeName: null,
    status: 'open',
    createdBy: 'u',
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  }
}
function notice(p: Partial<Notice>): Notice {
  return {
    id: 'x',
    familyId: 'fam',
    text: 'A notice',
    date: null,
    important: false,
    permanent: true,
    status: 'up',
    createdBy: 'u',
    createdByName: 'U',
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  }
}
function lost(p: Partial<LostItem>): LostItem {
  return {
    id: 'x',
    familyId: 'fam',
    description: 'A lost thing',
    status: 'searching',
    createdBy: 'u',
    createdByName: 'U',
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  }
}
function pantry(p: Partial<PantryItem>): PantryItem {
  return {
    id: 'x',
    familyId: 'fam',
    name: 'Dal',
    madeOn: null,
    keepsDays: null,
    quantity: 1,
    status: 'instock',
    createdBy: 'u',
    createdByName: 'U',
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  }
}
function question(p: Partial<Question>): Question {
  return {
    id: 'x',
    familyId: 'fam',
    text: 'A question?',
    answers: [],
    status: 'open',
    createdBy: 'u',
    createdByName: 'U',
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  }
}

function collections(p: Partial<AgendaCollections>): AgendaCollections {
  return { tasks: [], notices: [], lostItems: [], pantryItems: [], questions: [], ...p }
}

describe('pantryExpiryIso', () => {
  it('is madeOn + keepsDays', () => {
    expect(pantryExpiryIso({ madeOn: '2026-07-20', keepsDays: 10 })).toBe('2026-07-30')
  })
  it('is null when either part is missing', () => {
    expect(pantryExpiryIso({ madeOn: null, keepsDays: 5 })).toBeNull()
    expect(pantryExpiryIso({ madeOn: '2026-07-20', keepsDays: null })).toBeNull()
  })
})

describe('dayDiff', () => {
  it('counts whole calendar days', () => {
    expect(dayDiff('2026-07-26', '2026-07-28')).toBe(2)
    expect(dayDiff('2026-07-26', '2026-07-24')).toBe(-2)
    expect(dayDiff('2026-07-26', 'nope')).toBeNull()
  })
})

describe('buildAgenda', () => {
  it('maps each active type with its relevant date', () => {
    const items = buildAgenda(
      collections({
        tasks: [task({ id: 't1', description: 'Buy milk', targetDate: '2026-07-27' })],
        notices: [notice({ id: 'n1', text: 'Holiday', date: '2026-07-30' })],
        lostItems: [lost({ id: 'l1', description: 'Keys' })],
        pantryItems: [pantry({ id: 'p1', name: 'Curry', madeOn: '2026-07-25', keepsDays: 3 })],
        questions: [question({ id: 'q1', text: 'Pizza?' })],
      }),
      NOW,
    )
    expect(items).toEqual(
      expect.arrayContaining([
        { id: 'tasks:t1', type: 'tasks', title: 'Buy milk', date: '2026-07-27' },
        { id: 'notices:n1', type: 'notices', title: 'Holiday', date: '2026-07-30' },
        { id: 'lostFound:l1', type: 'lostFound', title: 'Keys', date: null },
        { id: 'pantry:p1', type: 'pantry', title: 'Curry', date: '2026-07-28' },
        { id: 'questions:q1', type: 'questions', title: 'Pizza?', date: null },
      ]),
    )
  })

  it('excludes inactive items (done / consumed / closed / off-board / deleted)', () => {
    const items = buildAgenda(
      collections({
        tasks: [
          task({ id: 'done', status: 'done' }),
          task({ id: 'del', deleted: true }),
        ],
        notices: [notice({ id: 'down', status: 'down' })],
        lostItems: [lost({ id: 'found', status: 'found' })],
        pantryItems: [pantry({ id: 'eaten', status: 'consumed' })],
        questions: [question({ id: 'closed', status: 'closed' })],
      }),
      NOW,
    )
    expect(items).toHaveLength(0)
  })
})

describe('recentAround', () => {
  const items: AgendaItem[] = [
    { id: 'a', type: 'tasks', title: 'past', date: '2026-07-20' },
    { id: 'b', type: 'notices', title: 'ahead', date: '2026-07-28' },
    { id: 'c', type: 'pantry', title: 'today', date: '2026-07-26' },
    { id: 'f', type: 'tasks', title: 'too far', date: '2026-07-30' },
    { id: 'd', type: 'lostFound', title: 'undated', date: null },
    { id: 'e', type: 'questions', title: 'undated2', date: null },
  ]

  it('puts everything before the focus date into overdue (all of it)', () => {
    const { overdue } = recentAround(items, '2026-07-26', 2)
    expect(overdue.map((i) => i.id)).toEqual(['a'])
  })

  it('windows "around" forward only: focus .. focus+2', () => {
    const { around } = recentAround(items, '2026-07-26', 2)
    // 26th (today) and 28th (+2); 30th (+4) is out, 20th is overdue not around.
    expect(around.map((i) => i.id)).toEqual(['c', 'b'])
  })

  it('collects all undated items separately (for the bottom)', () => {
    const { undated } = recentAround(items, '2026-07-26', 2)
    expect(undated.map((i) => i.id)).toEqual(['d', 'e'])
  })

  it('re-centres overdue/around on a different focus date', () => {
    const { overdue, around } = recentAround(items, '2026-07-29', 2)
    expect(overdue.map((i) => i.id)).toEqual(['a', 'c', 'b']) // all before the 29th
    expect(around.map((i) => i.id)).toEqual(['f']) // only the 30th is within +2
  })
})

describe('typesByDay', () => {
  it('groups distinct types per day in display order', () => {
    const map = typesByDay([
      { id: '1', type: 'questions', title: 'q', date: '2026-07-28' },
      { id: '2', type: 'tasks', title: 't', date: '2026-07-28' },
      { id: '3', type: 'tasks', title: 't2', date: '2026-07-28' },
      { id: '4', type: 'notices', title: 'n', date: null },
    ])
    expect(map.get('2026-07-28')).toEqual(['tasks', 'questions'])
    expect(map.has('null')).toBe(false)
  })
})

describe('monthMatrix', () => {
  it('is a 42-cell grid starting on the Sunday on/before the 1st', () => {
    const cells = monthMatrix(2026, 6) // July 2026; 1st is a Wednesday
    expect(cells).toHaveLength(42)
    expect(cells[0].iso).toBe('2026-06-28') // Sunday before Jul 1
    const inMonth = cells.filter((c) => c.inMonth)
    expect(inMonth).toHaveLength(31)
    expect(inMonth[0].iso).toBe('2026-07-01')
    expect(inMonth[30].iso).toBe('2026-07-31')
  })

  it('round-trips today via toIsoDate', () => {
    const iso = toIsoDate(new Date(2026, 6, 26))
    expect(iso).toBe('2026-07-26')
  })
})
