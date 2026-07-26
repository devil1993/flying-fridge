import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  monthMatrix,
  typesByDay,
  parseIsoDate,
  type AgendaItem,
} from './agenda'

/** Localised short weekday headers, Sunday-first (2023-01-01 was a Sunday). */
function weekdayLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + i)))
}

/** Current-month grid; days with timed items show colour-coded dots. */
export default function MonthCalendar({
  items,
  todayIso,
  focusIso,
  onOpenDay,
}: {
  items: AgendaItem[]
  todayIso: string
  focusIso: string
  onOpenDay: (iso: string) => void
}) {
  const { t, i18n } = useTranslation()
  const today = parseIsoDate(todayIso) ?? new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const cells = useMemo(() => monthMatrix(year, month), [year, month])
  const dots = useMemo(() => typesByDay(items), [items])
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) {
      if (!it.date) continue
      map.set(it.date, (map.get(it.date) ?? 0) + 1)
    }
    return map
  }, [items])

  const weekdays = useMemo(() => weekdayLabels(i18n.language), [i18n.language])
  const monthTitle = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1))

  return (
    <div className="cal">
      <p className="cal-title">{monthTitle}</p>

      <div className="cal-grid" role="grid" aria-label={monthTitle}>
        {weekdays.map((w, i) => (
          <span key={`wd-${i}`} className="cal-weekday" role="columnheader">
            {w}
          </span>
        ))}

        {cells.map((cell) => {
          if (!cell.inMonth) {
            return <span key={cell.iso} className="cal-day cal-day--out" aria-hidden="true" />
          }
          const types = dots.get(cell.iso) ?? []
          const count = counts.get(cell.iso) ?? 0
          const classes = ['cal-day']
          if (cell.iso === todayIso) classes.push('cal-day--today')
          if (cell.iso === focusIso) classes.push('cal-day--focus')
          const label =
            count > 0
              ? t('dashboard.dayItems', { day: cell.day, count })
              : String(cell.day)
          return (
            <button
              key={cell.iso}
              type="button"
              className={classes.join(' ')}
              aria-label={label}
              aria-current={cell.iso === todayIso ? 'date' : undefined}
              onClick={() => onOpenDay(cell.iso)}
            >
              <span className="cal-day-num">{cell.day}</span>
              {types.length > 0 && (
                <span className="cal-dots" aria-hidden="true">
                  {types.map((ty) => (
                    <span key={ty} className={`cal-dot cal-dot--${ty.toLowerCase()}`} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
