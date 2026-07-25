import { useEffect, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { GUIDE_MODULES } from './modules'
import { moduleIcon } from './moduleIcons'
import './guide.css'

export default function GuidePage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('guide.meta.title')
  }, [t])

  return (
    <main id="main-content" className="guide">
      <div className="guide-wrap">
        <p className="guide-eyebrow">{t('guide.eyebrow')}</p>
        <h1 className="guide-title">{t('guide.title')}</h1>
        <p className="guide-lead">{t('guide.intro.body')}</p>

        <nav className="guide-toc" aria-label={t('guide.tocLabel')}>
          <ul>
            {GUIDE_MODULES.map((m) => (
              <li key={m.id}>
                <a href={`#${m.slug}`}>{t(`guide.modules.${m.id}.title`)}</a>
              </li>
            ))}
          </ul>
        </nav>

        {GUIDE_MODULES.map((m) => {
          const steps = t(`guide.modules.${m.id}.steps`, {
            returnObjects: true,
          }) as unknown as string[]
          const headingId = `${m.slug}-heading`
          return (
            <section
              key={m.id}
              id={m.slug}
              className="guide-module"
              aria-labelledby={headingId}
              style={{ '--accent': `var(${m.accentVar})` } as CSSProperties}
            >
              <div className="guide-module-head">
                <span className="guide-module-icon" aria-hidden="true">
                  {moduleIcon(m.id)}
                </span>
                <h2 id={headingId}>{t(`guide.modules.${m.id}.title`)}</h2>
              </div>
              <p className="guide-summary">{t(`guide.modules.${m.id}.summary`)}</p>
              <ol className="guide-steps">
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <p className="guide-tip">
                <span className="guide-tip-label">{t('guide.tipLabel')}</span>{' '}
                {t(`guide.modules.${m.id}.tip`)}
              </p>
            </section>
          )
        })}

        <p className="guide-back">
          <Link to="/">{t('guide.backHome')}</Link>
        </p>
      </div>
    </main>
  )
}
