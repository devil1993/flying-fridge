import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useLostFound } from './useLostFound'
import { isSearching, daysSince } from './lostLogic'
import { lostRepository } from './lostRepositoryInstance'
import type { LostRepository } from './repository'
import './lostfound.css'

export default function LostFoundBoard({
  repository = lostRepository,
}: {
  repository?: LostRepository
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const { items, addItem, markFound, takeDown } = useLostFound(
    repository,
    familyId,
    actor,
  )
  const [desc, setDesc] = useState('')
  const now = Date.now()
  const searching = items.filter(isSearching)

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!desc.trim()) return
    addItem({ description: desc.trim() })
    setDesc('')
  }

  return (
    <section className="module lostfound" aria-labelledby="lost-heading">
      <h1 id="lost-heading" className="module-title">
        {t('lostFound.title')}
      </h1>

      <form className="lost-add" onSubmit={onAdd}>
        <label className="sr-only" htmlFor="lost-desc">
          {t('lostFound.add.descriptionLabel')}
        </label>
        <input
          id="lost-desc"
          className="lost-add-input"
          placeholder={t('lostFound.add.placeholder')}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit" className="lost-add-submit">
          {t('lostFound.add.submit')}
        </button>
      </form>

      {searching.length === 0 ? (
        <p className="task-empty">{t('lostFound.empty')}</p>
      ) : (
        <ul className="lost-list">
          {searching.map((item) => {
            const days = daysSince(item.createdAt, now)
            return (
              <li key={item.id} className="lost-card">
                <div className="lost-main">
                  <p className="lost-desc">{item.description}</p>
                  <div className="lost-meta">
                    <span>
                      {days === 0
                        ? t('lostFound.postedToday')
                        : t('lostFound.postedAgo', { count: days })}
                    </span>
                    <span>{t('lostFound.by', { name: item.createdByName })}</span>
                  </div>
                </div>
                <div className="lost-actions">
                  <button type="button" onClick={() => markFound(item.id)}>
                    {t('lostFound.markFound')}
                  </button>
                  <button type="button" onClick={() => takeDown(item.id)}>
                    {t('lostFound.takeDown')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
