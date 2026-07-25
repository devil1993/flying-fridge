/**
 * App-wide theme control: two axes on <html> — mode (light/dark) and palette.
 * Tokens live in src/styles/theme.css; this module just sets the attributes
 * and persists the user's choice, so every route (not only the landing page)
 * reflects the same theme.
 */

export const PALETTES = ['blueberry', 'grape', 'forest', 'ocean', 'contrast'] as const
export type Palette = (typeof PALETTES)[number]
export type Mode = 'light' | 'dark'

const MODE_KEY = 'ff-theme'
const PALETTE_KEY = 'ff-palette'

const darkMql = () => window.matchMedia('(prefers-color-scheme: dark)')

export function systemMode(): Mode {
  return darkMql().matches ? 'dark' : 'light'
}

function storedMode(): Mode | null {
  const v = localStorage.getItem(MODE_KEY)
  return v === 'light' || v === 'dark' ? v : null
}

export function currentMode(): Mode {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'light' || attr === 'dark' ? attr : systemMode()
}

export function currentPalette(): Palette {
  const attr = document.documentElement.getAttribute('data-palette') ?? ''
  return (PALETTES as readonly string[]).includes(attr) ? (attr as Palette) : 'blueberry'
}

/** Keep the browser UI (address bar) colour in sync with the active theme. */
function syncThemeColor(): void {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--col-primary')
    .trim()
  if (!primary) return
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = primary
}

export function setMode(mode: Mode, persist = true): void {
  document.documentElement.setAttribute('data-theme', mode)
  if (persist) localStorage.setItem(MODE_KEY, mode)
  syncThemeColor()
}

export function toggleMode(): void {
  setMode(currentMode() === 'dark' ? 'light' : 'dark')
}

export function setPalette(palette: Palette): void {
  document.documentElement.setAttribute('data-palette', palette)
  localStorage.setItem(PALETTE_KEY, palette)
  syncThemeColor()
}

/**
 * Apply the saved (or preferred) theme. Call once at startup so all routes are
 * themed. Defaults: stored mode, else system; stored palette, else High
 * Contrast when the OS asks for more contrast, else Blueberry.
 */
export function applyStoredTheme(): void {
  const el = document.documentElement
  el.setAttribute('data-theme', storedMode() ?? systemMode())

  const storedPalette = localStorage.getItem(PALETTE_KEY)
  const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches
  el.setAttribute(
    'data-palette',
    storedPalette && (PALETTES as readonly string[]).includes(storedPalette)
      ? storedPalette
      : prefersMoreContrast
        ? 'contrast'
        : 'blueberry',
  )
  syncThemeColor()
}

/** Follow the system mode while the user hasn't chosen one. Returns cleanup. */
export function watchSystemMode(): () => void {
  const mql = darkMql()
  const onChange = () => {
    if (!storedMode()) setMode(systemMode(), false)
  }
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
