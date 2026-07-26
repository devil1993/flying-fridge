import { useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import RecentItems from './RecentItems'
import MonthCalendar from './MonthCalendar'
import { toIsoDate, type AgendaItem } from './agenda'
import './agenda.css'

type View = 'recent' | 'calendar'
const VIEWS: View[] = ['recent', 'calendar']

/**
 * The dashboard's informed split view: a tabbed Recent list + month Calendar.
 * Tapping a calendar day opens Recent focused on that date; a "back to today"
 * control appears whenever the focus isn't today. (Requirement-6.)
 */
export default function AgendaSplit({ items }: { items: AgendaItem[] }) {
  const { t } = useTranslation()
  const todayIso = toIsoDate(new Date())
  const [view, setView] = useState<View>('recent')
  const [focusIso, setFocusIso] = useState(todayIso)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])

  const openDay = (iso: string) => {
    setFocusIso(iso)
    setView('recent')
  }

  // WAI-ARIA tabs: left/right arrows move between tabs and focus follows.
  const onTabKey = (e: KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (index + dir + VIEWS.length) % VIEWS.length
    setView(VIEWS[next])
    tabsRef.current[next]?.focus()
  }

  return (
    <div className="agenda">
      <div className="agenda-tabs" role="tablist" aria-label={t('dashboard.agenda')}>
        {VIEWS.map((v, i) => (
          <button
            key={v}
            ref={(el) => {
              tabsRef.current[i] = el
            }}
            type="button"
            role="tab"
            id={`agenda-tab-${v}`}
            aria-selected={view === v}
            aria-controls="agenda-panel"
            tabIndex={view === v ? 0 : -1}
            className={view === v ? 'agenda-tab is-active' : 'agenda-tab'}
            onClick={() => setView(v)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            {t(v === 'recent' ? 'dashboard.recent' : 'dashboard.calendar')}
          </button>
        ))}
      </div>

      <div
        id="agenda-panel"
        role="tabpanel"
        aria-labelledby={`agenda-tab-${view}`}
        className="agenda-panel"
        tabIndex={0}
      >
        {view === 'recent' ? (
          <RecentItems
            items={items}
            focusIso={focusIso}
            todayIso={todayIso}
            onBackToToday={() => setFocusIso(todayIso)}
          />
        ) : (
          <MonthCalendar
            items={items}
            todayIso={todayIso}
            focusIso={focusIso}
            onOpenDay={openDay}
          />
        )}
      </div>
    </div>
  )
}
