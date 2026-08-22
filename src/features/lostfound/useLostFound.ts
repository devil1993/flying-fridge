import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import { notifyItemAdded } from '../notifications/notify'
import type { LostItem, NewLostInput, EditLostInput, Actor } from './types'
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
      notifyItemAdded(familyId, 'lostFound', input.description, actor)
    },
    [repo, familyId, actor],
  )
  const editItem = useCallback(
    (id: string, changes: EditLostInput) => {
      void repo.update(id, changes)
      void track('lost_edit')
    },
    [repo],
  )
  const markFound = useCallback(
    (id: string) => {
      void repo.markFound(id)
      void track('lost_found')
    },
    [repo],
  )
  const takeDown = useCallback((id: string) => void repo.takeDown(id), [repo])
  const restore = useCallback(
    (id: string) => {
      void repo.restore(id)
      void track('lost_restore')
    },
    [repo],
  )

  return { items, addItem, editItem, markFound, takeDown, restore }
}
