import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useDraft } from '../app/useDraft'
import RecentlyClosed from '../app/RecentlyClosed'
import { useNotices } from './useNotices'
import { isOnBoard } from './noticeLogic'
import NoticeCard from './NoticeCard'
import { noticeRepository } from './noticeRepositoryInstance'
import type { NoticeRepository } from './repository'
import './notices.css'

export default function NoticesBoard({
  repository = noticeRepository,
}: {
  repository?: NoticeRepository
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const {
    notices,
    addNotice,
    editNotice,
    setImportant,
    setPermanent,
    takeDown,
    restore,
  } = useNotices(repository, familyId, actor)
  const [text, setText, clearText] = useDraft('notices.text')
  const [date, setDate, clearDate] = useDraft('notices.date')
  const [important, setImp] = useState(false)
  const [permanent, setPerm] = useState(false)

  const now = Date.now()
  const onBoard = notices.filter((n) => isOnBoard(n, now))
  const closed = notices
    .filter((n) => n.status === 'down' && !n.deleted)
    .map((n) => ({ id: n.id, title: n.text, updatedAt: n.updatedAt }))

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addNotice({ text: text.trim(), date: date || null, important, permanent })
    clearText()
    clearDate()
    setImp(false)
    setPerm(false)
  }

  return (
    <section className="module notices" aria-labelledby="notices-heading">
      <h1 id="notices-heading" className="module-title">
        {t('notices.title')}
      </h1>

      <form className="notice-add" onSubmit={onAdd}>
        <label className="sr-only" htmlFor="notice-text">
          {t('notices.add.textLabel')}
        </label>
        <textarea
          id="notice-text"
          className="notice-add-text"
          rows={2}
          placeholder={t('notices.add.textPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="notice-add-row">
          <input
            id="notice-date"
            className="notice-add-date"
            type="date"
            aria-label={t('notices.add.dateLabel')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label className="notice-check">
            <input
              type="checkbox"
              checked={important}
              onChange={(e) => setImp(e.target.checked)}
            />
            {t('notices.important')}
          </label>
          <label className="notice-check">
            <input
              type="checkbox"
              checked={permanent}
              onChange={(e) => setPerm(e.target.checked)}
            />
            {t('notices.permanent')}
          </label>
          <button type="submit" className="notice-add-submit">
            {t('notices.add.submit')}
          </button>
        </div>
      </form>

      {onBoard.length === 0 ? (
        <p className="task-empty">{t('notices.empty')}</p>
      ) : (
        <ul className="notice-list">
          {onBoard.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              now={now}
              onToggleImportant={setImportant}
              onTogglePermanent={setPermanent}
              onEdit={editNotice}
              onTakeDown={takeDown}
            />
          ))}
        </ul>
      )}

      <RecentlyClosed entries={closed} onRestore={restore} />
    </section>
  )
}
