import { useEffect } from 'react'
import { isEditable } from '../../lib/shortcuts'
import { APP_MODULES, useAppNav } from './appNav'

/**
 * Single-key shortcuts to switch modules (d/t/n). Only active while the app
 * shell is mounted (signed in with a family). Ignored while typing.
 */
export function useModuleShortcuts(): void {
  const { setActive } = useAppNav()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable(e.target)) return
      const match = APP_MODULES.find((m) => m.shortcut === e.key.toLowerCase())
      if (match) {
        e.preventDefault()
        setActive(match.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setActive])
}
