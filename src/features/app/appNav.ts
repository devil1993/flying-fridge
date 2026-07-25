import { createContext, useContext } from 'react'

export interface AppModule {
  id: string
  labelKey: string
  /** Single-key shortcut to switch to this module (shown on hover). */
  shortcut: string
}

/** Modules shown in the main nav when signed in with a family. */
export const APP_MODULES: AppModule[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', shortcut: 'd' },
  { id: 'tasks', labelKey: 'tasks.title', shortcut: 't' },
  { id: 'notices', labelKey: 'notices.title', shortcut: 'n' },
  { id: 'lostFound', labelKey: 'lostFound.title', shortcut: 'l' },
  { id: 'pantry', labelKey: 'pantry.title', shortcut: 'p' },
  { id: 'questions', labelKey: 'questions.title', shortcut: 'q' },
]

export interface AppNavValue {
  active: string
  setActive: (id: string) => void
}

export const AppNavContext = createContext<AppNavValue | null>(null)

export function useAppNav(): AppNavValue {
  const ctx = useContext(AppNavContext)
  if (!ctx) throw new Error('useAppNav must be used within <AppNavProvider>')
  return ctx
}
