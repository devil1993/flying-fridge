import { useTranslation } from 'react-i18next'
import './skip-link.css'

/**
 * Keyboard-first affordance: the first focusable element on the page jumps
 * focus straight to the main landmark. Visually hidden until focused.
 * Target id (#main-content) is set on each page's <main>.
 */
export default function SkipLink() {
  const { t } = useTranslation()
  return (
    <a className="skip-link" href="#main-content">
      {t('skip.toContent')}
    </a>
  )
}
