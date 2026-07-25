import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
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

  const { items, addItem, changeQuantity, markConsumed } = usePantry(
    repository,
    familyId,
    actor,
  )
  const [name, setName] = useState('')
  const [madeOn, setMadeOn] = useState('')
  const [keeps, setKeeps] = useState('')
  const [qty, setQty] = useState('1')

  const now = Date.now()
  const inStock = items.filter(isInStock)

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addItem({
      name: name.trim(),
      madeOn: madeOn || null,
      keepsDays: keeps ? Number(keeps) : null,
      quantity: qty ? Math.max(0, Number(qty)) : 1,
    })
    setName('')
    setMadeOn('')
    setKeeps('')
    setQty('1')
  }

  function freshnessLabel(item: PantryItem): string {
    const left = freshnessDaysLeft(item, now)
    if (left == null) return t('pantry.freshUnknown')
    if (left < 0) return t('pantry.expired')
    return t('pantry.freshDays', { count: left })
  }

  return (
    <section className="module" aria-labelledby="pantry-heading">
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
          {inStock.map((item) => (
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
                  className="pantry-consume"
                  onClick={() => markConsumed(item.id)}
                >
                  {t('pantry.consume')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
