import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import type { LostItem, NewLostInput, Actor } from './types'
import type { LostRepository } from './repository'

export function useLostFound(
  repo: LostRepository,
  familyId: string | null,
  actor: Actor,
) {
  const [items, setItems] = useState<LostItem[]>([])

  useEffect(() => {
    if (!familyId) {
      setItems([])
      return
    }
    return repo.subscribe(familyId, setItems)
  }, [repo, familyId])

  const addItem = useCallback(
    (input: NewLostInput) => {
      if (!familyId) return
      void repo.add(familyId, input, actor)
      void track('lost_add')
    },
    [repo, familyId, actor],
  )
  const markFound = useCallback(
    (id: string) => {
      void repo.markFound(id)
      void track('lost_found')
    },
    [repo],
  )
  const takeDown = useCallback((id: string) => void repo.takeDown(id), [repo])

  return { items, addItem, markFound, takeDown }
}
