import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useDraft } from '../app/useDraft'
import RecentlyClosed from '../app/RecentlyClosed'
import { usePantry } from './usePantry'
import { isInStock, freshnessDaysLeft } from './pantryLogic'
import { pantryRepository } from './pantryRepositoryInstance'
import { formatIsoDate } from '../../lib/date'
import type { PantryItem } from './types'
import type { PantryRepository } from './repository'
import './pantry.css'

export default function PantryBoard({
  repository = pantryRepository,
}: {
  repository?: PantryRepository
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const { items, addItem, editItem, changeQuantity, markConsumed, restore } =
    usePantry(repository, familyId, actor)
  const [name, setName, clearName] = useDraft('pantry.name')
  const [madeOn, setMadeOn, clearMadeOn] = useDraft('pantry.madeOn')
  const [keeps, setKeeps, clearKeeps] = useDraft('pantry.keeps')
  const [qty, setQty, clearQty] = useDraft('pantry.qty', '1')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editMadeOn, setEditMadeOn] = useState('')
  const [editKeeps, setEditKeeps] = useState('')

  const now = Date.now()
  const inStock = items.filter(isInStock)
  const closed = items
    .filter((i) => i.status === 'consumed')
    .map((i) => ({ id: i.id, title: i.name, updatedAt: i.updatedAt }))

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addItem({
      name: name.trim(),
      madeOn: madeOn || null,
      keepsDays: keeps ? Number(keeps) : null,
      quantity: qty ? Math.max(0, Number(qty)) : 1,
    })
    clearName()
    clearMadeOn()
    clearKeeps()
    clearQty()
  }

  function startEdit(item: PantryItem) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditMadeOn(item.madeOn ?? '')
    setEditKeeps(item.keepsDays != null ? String(item.keepsDays) : '')
  }

  function saveEdit(e: FormEvent) {
    e.preventDefault()
    if (!editingId || !editName.trim()) return
    editItem(editingId, {
      name: editName.trim(),
      madeOn: editMadeOn || null,
      keepsDays: editKeeps ? Math.max(0, Number(editKeeps)) : null,
    })
    setEditingId(null)
  }

  function freshnessLabel(item: PantryItem): string {
    const left = freshnessDaysLeft(item, now)
    if (left == null) return t('pantry.freshUnknown')
    if (left < 0) return t('pantry.expired')
    return t('pantry.freshDays', { count: left })
  }

  return (
    <section className="module pantry" aria-labelledby="pantry-heading">
      <h1 id="pantry-heading" className="module-title">
        {t('pantry.title')}
      </h1>

      <form className="pantry-add" onSubmit={onAdd}>
        <label className="sr-only" htmlFor="pantry-name">
          {t('pantry.add.nameLabel')}
        </label>
        <input
          id="pantry-name"
          className="pantry-add-name"
          placeholder={t('pantry.add.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="pantry-add-row">
          <label className="pantry-field">
            <span>{t('pantry.add.madeOn')}</span>
            <input
              type="date"
              value={madeOn}
              onChange={(e) => setMadeOn(e.target.value)}
            />
          </label>
          <label className="pantry-field">
            <span>{t('pantry.add.keepsDays')}</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={keeps}
              onChange={(e) => setKeeps(e.target.value)}
            />
          </label>
          <label className="pantry-field">
            <span>{t('pantry.add.quantity')}</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>
          <button type="submit" className="pantry-add-submit">
            {t('pantry.add.submit')}
          </button>
        </div>
      </form>

      {inStock.length === 0 ? (
        <p className="task-empty">{t('pantry.empty')}</p>
      ) : (
        <ul className="pantry-list">
          {inStock.map((item) =>
            editingId === item.id ? (
              <li key={item.id} className="pantry-card">
                <form className="pantry-edit" onSubmit={saveEdit}>
                  <input
                    className="pantry-add-name"
                    aria-label={t('pantry.edit.nameLabel')}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div className="pantry-add-row">
                    <label className="pantry-field">
                      <span>{t('pantry.add.madeOn')}</span>
                      <input
                        type="date"
                        value={editMadeOn}
                        onChange={(e) => setEditMadeOn(e.target.value)}
                      />
                    </label>
                    <label className="pantry-field">
                      <span>{t('pantry.add.keepsDays')}</span>
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        value={editKeeps}
                        onChange={(e) => setEditKeeps(e.target.value)}
                      />
                    </label>
                    <button type="submit" disabled={!editName.trim()}>
                      {t('pantry.edit.save')}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)}>
                      {t('pantry.edit.cancel')}
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={item.id} className="pantry-card">
                <div className="pantry-main">
                  <p className="pantry-name">{item.name}</p>
                  <div className="pantry-meta">
                    <span>{freshnessLabel(item)}</span>
                    {item.madeOn && (
                      <span>
                        {t('pantry.madeOnLabel', {
                          date: formatIsoDate(item.madeOn),
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pantry-controls">
                  <div
                    className="pantry-qty"
                    role="group"
                    aria-label={t('pantry.quantityLabel', { name: item.name })}
                  >
                    <button
                      type="button"
                      aria-label={t('pantry.decrease')}
                      disabled={item.quantity <= 0}
                      onClick={() => changeQuantity(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="pantry-qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={t('pantry.increase')}
                      onClick={() => changeQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="pantry-edit-action"
                    onClick={() => startEdit(item)}
                  >
                    {t('pantry.edit.action')}
                  </button>
                  <button
                    type="button"
                    className="pantry-consume"
                    onClick={() => markConsumed(item.id)}
                  >
                    {t('pantry.consume')}
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      <RecentlyClosed entries={closed} onRestore={restore} />
    </section>
  )
}
