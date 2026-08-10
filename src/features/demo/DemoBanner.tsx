import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import './demo-banner.css'

function mmss(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * A slim bar shown throughout demo mode: says it's a demo, counts down to the
 * auto-reset, and offers a way out. Self-hides when not in demo.
 */
export default function DemoBanner() {
  const { t } = useTranslation()
  const { demoEndsAt, signOut } = useAuth()
  const { familyName } = useFamily()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!demoEndsAt) return null

  return (
    <div className="demo-banner" role="status">
      <span className="demo-banner-text">
        {t('demo.banner', { family: familyName ?? t('demo.family') })}{' '}
        <span className="demo-banner-time">
          {t('demo.endsIn', { time: mmss(demoEndsAt - now) })}
        </span>
      </span>
      <button
        type="button"
        className="demo-banner-exit"
        onClick={() => void signOut()}
      >
        {t('demo.exit')}
      </button>
    </div>
  )
}
