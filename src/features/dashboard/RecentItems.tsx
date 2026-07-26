import { useTranslation } from 'react-i18next'
import { useAppNav } from '../app/appNav'
import { formatIsoDate } from '../../lib/date'
import { recentAround, parseIsoDate, type AgendaItem, type AgendaType } from './agenda'

/** Maps an agenda type to the module id used by the nav + its i18n title. */
const TITLE_KEY: Record<AgendaType, string> = {
  tasks: 'tasks.title',
  notices: 'notices.title',
  lostFound: 'lostFound.title',
  pantry: 'pantry.title',
  questions: 'questions.title',
}

function fullDate(iso: string, locale: string): string {
  const d = parseIsoDate(iso)
  if (!d) return iso
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** Recent items around a focus date; undated ones sink to the bottom. */
export default function RecentItems({
  items,
  focusIso,
  todayIso,
  onBackToToday,
}: {
  items: AgendaItem[]
  focusIso: string
  todayIso: string
  onBackToToday: () => void
}) {
  const { t, i18n } = useTranslation()
  const { setActive } = useAppNav()
  const { overdue, around, undated } = recentAround(items, focusIso)
  const isToday = focusIso === todayIso
  const isEmpty =
    overdue.length === 0 && around.length === 0 && undated.length === 0

  const row = (it: AgendaItem) => (
    <li key={it.id}>
      <button
        type="button"
        className={`agenda-item agenda-item--${it.type.toLowerCase()}`}
        onClick={() => setActive(it.type)}
      >
        <span className="agenda-item-title">{it.title}</span>
        <span className="agenda-item-meta">
          <span className="agenda-item-type">{t(TITLE_KEY[it.type])}</span>
          {it.date && (
            <span className="agenda-item-date">{formatIsoDate(it.date)}</span>
          )}
        </span>
      </button>
    </li>
  )

  return (
    <div className="agenda-recent">
      <div className="agenda-head">
        <p className="agenda-focus">
          {isToday ? t('dashboard.today') : fullDate(focusIso, i18n.language)}
        </p>
        {!isToday && (
          <button type="button" className="agenda-back" onClick={onBackToToday}>
            {t('dashboard.backToToday')}
          </button>
        )}
      </div>

      {isEmpty ? (
        <p className="agenda-empty">{t('dashboard.recentEmpty')}</p>
      ) : (
        <>
          {overdue.length > 0 && (
            <>
              <p className="agenda-group-label agenda-group-label--overdue">
                {t('dashboard.overdue')}
              </p>
              <ul className="agenda-list">{overdue.map(row)}</ul>
            </>
          )}
          {around.length > 0 && (
            <>
              <p className="agenda-group-label">{t('dashboard.comingUp')}</p>
              <ul className="agenda-list">{around.map(row)}</ul>
            </>
          )}
          {undated.length > 0 && (
            <>
              <p className="agenda-group-label">{t('dashboard.noDate')}</p>
              <ul className="agenda-list">{undated.map(row)}</ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
