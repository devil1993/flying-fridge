import type { AppUser } from '../../lib/firebase'
import type { FamilyMember } from '../family/familyContext'
import type { Task } from '../tasks/types'
import type { Notice } from '../notices/types'
import type { LostItem } from '../lostfound/types'
import type { PantryItem } from '../pantry/types'
import type { Question } from '../questions/types'
import type { AppNotification } from '../notifications/types'

/**
 * Seed content for the ephemeral demo — the Ghosh household ("Ghosh Bari"), a
 * Kolkata family. Everything lives in memory and is wiped on exit / after 30
 * min, so it's deliberately lived-in, mundane and a little witty. Dates are
 * computed relative to "today" so the dashboard always looks alive (overdue,
 * due-soon, upcoming). See ADR-0017.
 */

export const DEMO_FAMILY_ID = 'demo-family'
export const DEMO_FAMILY_NAME = 'Ghosh Bari'
/** The visitor plays Rima; other members give the board a lived-in feel. */
export const DEMO_USER: AppUser = { id: 'demo-rima', name: 'Rima', email: null }

export const DEMO_MEMBERS: FamilyMember[] = [
  { uid: 'demo-rima', name: 'Rima', email: null },
  { uid: 'demo-anirban', name: 'Anirban', email: null },
  { uid: 'demo-dida', name: 'Dida', email: null },
  { uid: 'demo-bubai', name: 'Bubai', email: null },
]

const ME = DEMO_USER.id
const nameOf = (uid: string) =>
  DEMO_MEMBERS.find((m) => m.uid === uid)?.name ?? 'Someone'

/** ISO yyyy-mm-dd offset from today (local). */
function iso(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface DemoData {
  tasks: Task[]
  notices: Notice[]
  lost: LostItem[]
  pantry: PantryItem[]
  questions: Question[]
  notifications: AppNotification[]
}

/** Builds a fresh set of demo records (timestamps relative to now). */
export function buildDemoData(): DemoData {
  const now = Date.now()
  const min = 60_000
  // Decreasing createdAt so lists read newest-first believably.
  let seq = 0
  const at = () => now - seq++ * 7 * min

  const task = (
    id: string,
    description: string,
    targetDate: string | null,
    by: string,
    extra: Partial<Task> = {},
  ): Task => {
    const ts = at()
    return {
      id,
      familyId: DEMO_FAMILY_ID,
      description,
      targetDate,
      assigneeId: null,
      assigneeName: null,
      status: 'open',
      deleted: false,
      createdBy: by,
      createdAt: ts,
      updatedAt: ts,
      ...extra,
    }
  }
  const assigned = (uid: string) => ({ assigneeId: uid, assigneeName: nameOf(uid) })

  const tasks: Task[] = [
    task('demo-t1', 'Buy rui fish from Gariahat — Baba insists it must look surprised', iso(0), 'demo-anirban', assigned('demo-anirban')),
    task('demo-t2', 'Fix the dripping kitchen tap (reminder #4)', iso(-2), 'demo-rima'),
    task('demo-t3', "Recharge the WiFi before Dida's 8 o'clock serial", iso(0), 'demo-rima', assigned('demo-rima')),
    task('demo-t4', "Return Sharma-ji's ladder before he 'reminds' us again", iso(2), 'demo-bubai'),
    task('demo-t5', "Water Dida's tulsi — she WILL notice if it droops", iso(1), 'demo-dida', assigned('demo-bubai')),
    task('demo-t6', 'Pay the electricity bill', iso(-1), 'demo-rima', assigned('demo-rima')),
    task('demo-t7', 'Sort the steel almirah someday (not today)', null, 'demo-rima'),
    task('demo-t8', 'Book the gas cylinder', iso(-3), 'demo-rima', { status: 'done', ...assigned('demo-rima') }),
  ]

  const notice = (
    id: string,
    text: string,
    date: string | null,
    by: string,
    extra: Partial<Notice> = {},
  ): Notice => {
    const ts = at()
    return {
      id,
      familyId: DEMO_FAMILY_ID,
      text,
      date,
      important: false,
      permanent: false,
      status: 'up',
      deleted: false,
      createdBy: by,
      createdByName: nameOf(by),
      createdAt: ts,
      updatedAt: ts,
      ...extra,
    }
  }
  const notices: Notice[] = [
    notice('demo-n1', 'Load-shedding Sunday 2–4 PM. Charge everything, including your patience.', iso(((7 - new Date().getDay()) % 7) || 0), 'demo-anirban', { important: true }),
    notice('demo-n2', "Dida's eye check-up Thursday 11 AM. Someone drive her — NOT Bubai.", iso(3), 'demo-rima', { important: true }),
    notice('demo-n3', 'WiFi password is GhoshBari@2026. Memorise it. Stop asking.', null, 'demo-rima', { permanent: true }),
    notice('demo-n4', 'Milkman on chhuti till Monday. Black tea, build character.', null, 'demo-dida'),
    notice('demo-n5', 'Mejo-kaku visiting this weekend', null, 'demo-anirban', { status: 'down' }),
  ]

  const lost = (id: string, description: string, by: string, extra: Partial<LostItem> = {}): LostItem => {
    const ts = at()
    return {
      id,
      familyId: DEMO_FAMILY_ID,
      description,
      status: 'searching',
      createdBy: by,
      createdByName: nameOf(by),
      createdAt: ts,
      updatedAt: ts,
      ...extra,
    }
  }
  const lostItems: LostItem[] = [
    lost('demo-l1', 'One blue Bata slipper, left foot. The right one is fine and lonely.', 'demo-bubai'),
    lost('demo-l2', "Dida's reading glasses. Check her forehead first.", 'demo-rima'),
    lost('demo-l3', 'The GOOD scissors. Not the craft ones. The GOOD ones.', 'demo-rima'),
    lost('demo-l4', 'TV remote (last seen, inexplicably, in the fridge)', 'demo-anirban', { status: 'found' }),
  ]

  const pantry = (
    id: string,
    name: string,
    madeOn: string | null,
    keepsDays: number | null,
    quantity: number,
    by: string,
    extra: Partial<PantryItem> = {},
  ): PantryItem => {
    const ts = at()
    return {
      id,
      familyId: DEMO_FAMILY_ID,
      name,
      madeOn,
      keepsDays,
      quantity,
      status: 'instock',
      createdBy: by,
      createdByName: nameOf(by),
      createdAt: ts,
      updatedAt: ts,
      ...extra,
    }
  }
  const pantryItems: PantryItem[] = [
    pantry('demo-p1', "Mishti doi from Ganguram's", iso(-1), 3, 4, 'demo-dida'),
    pantry('demo-p2', 'Leftover kosha mangsho (guard it)', iso(-1), 2, 1, 'demo-rima'),
    pantry('demo-p3', 'Rosogolla — count is dropping suspiciously', iso(0), 4, 6, 'demo-bubai'),
    pantry('demo-p4', 'Half a lauki nobody will claim', iso(-3), 6, 1, 'demo-anirban'),
    pantry('demo-p5', 'Puchka masala (emergency reserves)', null, null, 2, 'demo-rima'),
    pantry('demo-p6', "Sunday's biryani", iso(-2), 3, 0, 'demo-rima', { status: 'consumed' }),
  ]

  const answer = (text: string, uid: string) => ({
    text,
    byId: uid,
    byName: nameOf(uid),
    at: at(),
  })
  const question = (
    id: string,
    text: string,
    by: string,
    answers: Question['answers'],
    extra: Partial<Question> = {},
  ): Question => {
    const ts = at()
    return {
      id,
      familyId: DEMO_FAMILY_ID,
      text,
      answers,
      status: 'open',
      createdBy: by,
      createdByName: nameOf(by),
      createdAt: ts,
      updatedAt: ts,
      ...extra,
    }
  }
  const questions: Question[] = [
    question('demo-q1', 'Chicken or mutton for Sunday?', 'demo-rima', [
      answer('Mutton. This is not a debate.', 'demo-anirban'),
      answer('Chicken — think of my cholesterol.', 'demo-dida'),
    ]),
    question('demo-q2', 'Whose turn is it to call the plumber?', 'demo-anirban', [
      answer('Not mine. I handled the electrician saga.', 'demo-bubai'),
    ]),
    question('demo-q3', "Can we skip Boro-mashi's invite this Pujo? Purely hypothetical.", 'demo-bubai', []),
    question('demo-q4', 'Roll or chowmein for Friday dinner?', 'demo-rima', [answer('Roll. Always roll.', 'demo-bubai')], { status: 'closed' }),
  ]

  // Notifications from OTHER members, so the visitor (Rima) sees unread ones.
  const notif = (id: string, module: AppNotification['module'], excerpt: string, by: string): AppNotification => ({
    id,
    familyId: DEMO_FAMILY_ID,
    module,
    excerpt,
    actorId: by,
    actorName: nameOf(by),
    createdAt: at(),
  })
  const notifications: AppNotification[] = [
    notif('demo-nt1', 'tasks', 'Buy rui fish from Gariahat', 'demo-anirban'),
    notif('demo-nt2', 'pantry', "Mishti doi from Ganguram's", 'demo-dida'),
    notif('demo-nt3', 'questions', 'Whose turn is it to call the plumber?', 'demo-anirban'),
    notif('demo-nt4', 'notices', 'Load-shedding Sunday 2–4 PM', 'demo-anirban'),
  ].filter((n) => n.actorId !== ME)

  return { tasks, notices, lost: lostItems, pantry: pantryItems, questions, notifications }
}
