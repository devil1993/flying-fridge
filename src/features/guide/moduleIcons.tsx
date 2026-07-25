import type { ReactElement } from 'react'

/**
 * Compact line icons for each guide module, keyed by module id. Stroke uses
 * currentColor so the surrounding section can tint it with the module accent.
 */
const ICONS: Record<string, ReactElement> = {
  tasks: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10 L10.5 12.5 L14.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16 L10.5 18.5 L14.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  notices: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3 L25 8 L25 20 Q25 25 14 27 Q3 25 3 20 L3 8 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="14" cy="12" r="2" fill="currentColor" />
      <line x1="14" y1="15" x2="14" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  lostFound: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="17" y1="17" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 9.5 a1.6 1.6 0 1 1 1.2 2.6 v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  ),
  pantry: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M8 4 h12 v3 l-2 2 v14 a2 2 0 0 1-2 2 h-4 a2 2 0 0 1-2-2 v-14 l-2-2 z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="10" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  questions: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 6 h20 v13 h-11 l-6 5 v-5 h-3 z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11.5 10.5 a2.5 2.5 0 1 1 3 3.4 v1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  appearance: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4 a10 10 0 1 0 0 20 c1.6 0 2-1.2 1.2-2.2 c-.8-1-.3-2.3 1-2.3 H18 a5 5 0 0 0 5-5 C23 8.5 19 4 14 4 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="9.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="14" cy="9.5" r="1.2" fill="currentColor" />
      <circle cx="18" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  notifications: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M21 11 A7 7 0 0 0 7 11 c0 8-3.5 10-3.5 10 h21 s-3.5-2-3.5-10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 24 a2.4 2.4 0 0 1-4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="7" r="3.2" fill="currentColor" />
    </svg>
  ),
}

export function moduleIcon(id: string): ReactElement | null {
  return ICONS[id] ?? null
}
