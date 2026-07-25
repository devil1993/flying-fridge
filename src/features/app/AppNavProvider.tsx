import { useMemo, useState, type ReactNode } from 'react'
import { AppNavContext, type AppNavValue } from './appNav'

export function AppNavProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('dashboard')
  const value = useMemo<AppNavValue>(() => ({ active, setActive }), [active])
  return <AppNavContext.Provider value={value}>{children}</AppNavContext.Provider>
}
