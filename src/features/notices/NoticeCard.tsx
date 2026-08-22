import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { daysLeft } from './noticeLogic'
import { formatIsoDate } from '../../lib/date'
import type { Notice, EditNoticeInput } from './types'

interface Props {
  notice: Notice
  now: number
  onToggleImportant: (id: string, important: boolean) => void
  onTogglePermanent: (id: string, permanent: boolean) => void
  onEdit: (id: string, changes: EditNoticeInput) => void
  onTakeDown: (id: string) => void
}

export default function NoticeCard({
  notice,
  now,
  onToggleImportant,
  onTogglePermanent,
  onEdit,
  onTakeDown,
}: Props) {
  const { t } = useTranslation()
  const left = daysLeft(notice, now)

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(notice.text)
  const [date, setDate] = useState(notice.date ?? '')

  function startEdit() {
    setText(notice.text)
    setDate(notice.date ?? '')
    setEditing(true)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onEdit(notice.id, { text: text.trim(), date: date || null })
    setEditing(false)
  }

  if (editing) {
    return (
      <li
        className={
          notice.important ? 'notice-card notice-card--important' : 'notice-card'
        }
      >
        <form className="notice-edit" onSubmit={save}>
          <textarea
            className="notice-add-text"
            rows={2}
            aria-label={t('notices.edit.textLabel')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="notice-add-row">
            <input
              className="notice-add-date"
              type="date"
              aria-label={t('notices.edit.dateLabel')}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" disabled={!text.trim()}>
              {t('notices.edit.save')}
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              {t('notices.edit.cancel')}
            </button>
          </div>
        </form>
      </li>
    )
  }

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
        <button type="button" onClick={startEdit}>
          {t('notices.edit.action')}
        </button>
        <button type="button" onClick={() => onTakeDown(notice.id)}>
          {t('notices.takeDown')}
        </button>
      </div>
    </li>
  )
}
