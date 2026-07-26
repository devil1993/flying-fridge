import { useTranslation } from 'react-i18next'
import './recently-closed.css'

/** How many recently-closed items a board shows for undo. */
export const CLOSED_LIMIT = 5

export interface ClosedEntry {
  id: string
  title: string
  updatedAt: number
}

/**
 * A small "Recently closed" list with a restore action, shared by the boards so
 * a mistakenly completed / taken-down / consumed / closed item can be brought
 * back. Renders nothing when there's nothing closed.
 */
export default function RecentlyClosed({
  entries,
  onRestore,
}: {
  entries: ClosedEntry[]
  onRestore: (id: string) => void
}) {
  const { t } = useTranslation()
  if (entries.length === 0) return null

  const shown = [...entries]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, CLOSED_LIMIT)

  return (
    <section className="recently-closed" aria-label={t('closed.title')}>
      <h2 className="recently-closed-title">{t('closed.title')}</h2>
      <ul className="recently-closed-list">
        {shown.map((e) => (
          <li key={e.id} className="recently-closed-item">
            <span className="recently-closed-text">{e.title}</span>
            <button
              type="button"
              className="recently-closed-restore"
              onClick={() => onRestore(e.id)}
            >
              {t('closed.restore')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
