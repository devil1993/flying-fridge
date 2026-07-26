import { useCallback, useState } from 'react'

/**
 * A string form field that survives navigation. Switching modules unmounts the
 * board (the app shell renders only the active one), which would otherwise drop
 * an in-progress entry — so drafts are mirrored to localStorage and restored on
 * remount. Call `clear()` after a successful submit.
 *
 * Keys are namespaced by caller (e.g. `tasks.desc`) and, ideally, by family so
 * drafts don't leak across families on a shared device.
 */
export function useDraft(
  key: string,
  initial = '',
): readonly [string, (v: string) => void, () => void] {
  const storageKey = `ff.draft.${key}`

  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) ?? initial
    } catch {
      return initial
    }
  })

  const set = useCallback(
    (v: string) => {
      setValue(v)
      try {
        if (v) localStorage.setItem(storageKey, v)
        else localStorage.removeItem(storageKey)
      } catch {
        /* storage unavailable — draft persistence is best-effort */
      }
    },
    [storageKey],
  )

  const clear = useCallback(() => {
    setValue(initial)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }, [storageKey, initial])

  return [value, set, clear] as const
}
