import { useCallback, useEffect, useRef } from 'react'
import { track } from '../../lib/firebase'

/**
 * Observability for feature usage (requirement-5): counts each feature view,
 * and — when leaving a feature — the seconds spent on it and the number of
 * clicks within it. Emits Firebase Analytics events (no-op without Analytics):
 *   - feature_view       { feature }
 *   - feature_engagement { feature, seconds, clicks }
 *
 * Returns an onClickCapture handler to spread on the app container so clicks are
 * counted per feature.
 */
export function useFeatureTelemetry(active: string) {
  const startRef = useRef(Date.now())
  const clicksRef = useRef(0)
  const prevRef = useRef(active)

  useEffect(() => {
    if (prevRef.current !== active) {
      const seconds = Math.round((Date.now() - startRef.current) / 1000)
      void track('feature_engagement', {
        feature: prevRef.current,
        seconds,
        clicks: clicksRef.current,
      })
      startRef.current = Date.now()
      clicksRef.current = 0
      prevRef.current = active
    }
    void track('feature_view', { feature: active })
  }, [active])

  useEffect(() => {
    // Flush the final feature's engagement when the app unmounts.
    return () => {
      const seconds = Math.round((Date.now() - startRef.current) / 1000)
      void track('feature_engagement', {
        feature: prevRef.current,
        seconds,
        clicks: clicksRef.current,
      })
    }
  }, [])

  const onClickCapture = useCallback(() => {
    clicksRef.current += 1
  }, [])

  return { onClickCapture }
}
