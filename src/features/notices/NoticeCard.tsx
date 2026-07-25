import { useTranslation } from 'react-i18next'
import { daysLeft } from './noticeLogic'
import { formatIsoDate } from '../../lib/date'
import type { Notice } from './types'

interface Props {
  notice: Notice
  now: number
  onToggleImportant: (id: string, important: boolean) => void
  onTogglePermanent: (id: string, permanent: boolean) => void
  onTakeDown: (id: string) => void
}

export default function NoticeCard({
  notice,
  now,
  onToggleImportant,
  onTogglePermanent,
  onTakeDown,
}: Props) {
  const { t } = useTranslation()
  const left = daysLeft(notice, now)

  return (
    <li
      className={
        notice.important ? 'notice-card notice-card--important' : 'notice-card'
      }
    >
      <div className="notice-main">
        <p className="notice-text">{notice.text}</p>
        <div className="notice-meta">
          {notice.date && (
            <span className="notice-badge">
              {t('notices.on', { date: formatIsoDate(notice.date) })}
            </span>
          )}
          <span>{t('notices.by', { name: notice.createdByName })}</span>
          {notice.permanent ? (
            <span className="notice-badge">{t('notices.permanent')}</span>
          ) : (
            <span>{t('notices.expiresIn', { count: left ?? 0 })}</span>
          )}
          {notice.important && (
            <span className="notice-badge notice-badge--important">
              {t('notices.important')}
            </span>
          )}
        </div>
      </div>

      <div className="notice-actions">
        <button
          type="button"
          onClick={() => onToggleImportant(notice.id, !notice.important)}
        >
          {notice.important
            ? t('notices.unmarkImportant')
            : t('notices.markImportant')}
        </button>
        <button
          type="button"
          onClick={() => onTogglePermanent(notice.id, !notice.permanent)}
        >
          {notice.permanent
            ? t('notices.unmarkPermanent')
            : t('notices.makePermanent')}
        </button>
        <button type="button" onClick={() => onTakeDown(notice.id)}>
          {t('notices.takeDown')}
        </button>
      </div>
    </li>
  )
}
