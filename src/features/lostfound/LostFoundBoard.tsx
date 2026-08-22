import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useDraft } from '../app/useDraft'
import RecentlyClosed from '../app/RecentlyClosed'
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

  const { items, addItem, editItem, markFound, takeDown, restore } =
    useLostFound(repository, familyId, actor)
  const [desc, setDesc, clearDesc] = useDraft('lostfound.desc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const now = Date.now()
  const searching = items.filter(isSearching)
  const closed = items
    .filter((i) => i.status === 'found' || i.status === 'down')
    .map((i) => ({ id: i.id, title: i.description, updatedAt: i.updatedAt }))

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!desc.trim()) return
    addItem({ description: desc.trim() })
    clearDesc()
  }

  function startEdit(id: string, description: string) {
    setEditingId(id)
    setEditDesc(description)
  }

  function saveEdit(e: FormEvent) {
    e.preventDefault()
    if (!editingId || !editDesc.trim()) return
    editItem(editingId, { description: editDesc.trim() })
    setEditingId(null)
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
            if (editingId === item.id) {
              return (
                <li key={item.id} className="lost-card">
                  <form className="lost-edit" onSubmit={saveEdit}>
                    <input
                      className="lost-add-input"
                      aria-label={t('lostFound.edit.descriptionLabel')}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                    <div className="lost-actions">
                      <button type="submit" disabled={!editDesc.trim()}>
                        {t('lostFound.edit.save')}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)}>
                        {t('lostFound.edit.cancel')}
                      </button>
                    </div>
                  </form>
                </li>
              )
            }
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
                  <button
                    type="button"
                    onClick={() => startEdit(item.id, item.description)}
                  >
                    {t('lostFound.edit.action')}
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

      <RecentlyClosed entries={closed} onRestore={restore} />
    </section>
  )
}
