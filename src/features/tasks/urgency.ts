import type { Urgency } from './taskLogic'

/** Colour used to code a task by target-date urgency (UI concern). */
export const URGENCY_COLOR: Record<Urgency, string> = {
  overdue: '#d64545',
  today: 'var(--mag-pantry)',
  soon: 'var(--col-accent)',
  later: 'var(--mag-tasks)',
  none: 'var(--col-text-muted)',
}

/** Format an ISO yyyy-mm-dd for display (e.g. "Jul 28"). */
export function formatTargetDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
