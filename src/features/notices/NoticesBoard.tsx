import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
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

  const { notices, addNotice, setImportant, setPermanent, takeDown } =
    useNotices(repository, familyId, actor)
  const [text, setText] = useState('')
  const [important, setImp] = useState(false)
  const [permanent, setPerm] = useState(false)

  const now = Date.now()
  const onBoard = notices.filter((n) => isOnBoard(n, now))

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addNotice({ text: text.trim(), important, permanent })
    setText('')
    setImp(false)
    setPerm(false)
  }

  return (
    <section className="module" aria-labelledby="notices-heading">
      <h2 id="notices-heading" className="module-title">
        {t('notices.title')}
      </h2>

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
              onTakeDown={takeDown}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
