import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

import './i18n/config'
import './styles/global.css'
import App from './App'

// Register the service worker (PWA / offline shell). Push notifications are
// wired separately once Firebase is configured — see docs/design/pwa-and-notifications.md.
registerSW({ immediate: true })

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
