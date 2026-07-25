import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useFamily } from './familyContext'
import './family.css'

export default function FamilySetup() {
  const { t } = useTranslation()
  const { join } = useFamily()
  const [name, setName] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (name.trim()) join(name)
  }

  return (
    <main id="main-content" className="family-setup">
      <div className="family-card">
        <h1>{t('tasks.family.setupTitle')}</h1>
        <p>{t('tasks.family.setupBody')}</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="family-name">{t('tasks.family.nameLabel')}</label>
          <input
            id="family-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">{t('tasks.family.join')}</button>
        </form>
      </div>
    </main>
  )
}
