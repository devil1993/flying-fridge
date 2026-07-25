import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface NavShortcut {
  key: string
  path: string
}

/** Single-key navigation shortcuts (shown on hover in the top nav). */
export const NAV_SHORTCUTS: NavShortcut[] = [
  { key: 'h', path: '/' },
  { key: 'g', path: '/guide' },
  { key: 'a', path: '/app' },
]

export function shortcutFor(path: string): string | null {
  return NAV_SHORTCUTS.find((s) => s.path === path)?.key.toUpperCase() ?? null
}

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  )
}

/** Registers the global single-key nav shortcuts. Ignored while typing. */
export function useNavShortcuts(): void {
  const navigate = useNavigate()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable(e.target)) return
      const match = NAV_SHORTCUTS.find((s) => s.key === e.key.toLowerCase())
      if (match) {
        e.preventDefault()
        navigate(match.path)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
}
