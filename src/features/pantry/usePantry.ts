import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import { notifyItemAdded } from '../notifications/notify'
import type { PantryItem, NewPantryInput, EditPantryInput, Actor } from './types'
import type { PantryRepository } from './repository'

export function usePantry(
  repo: PantryRepository,
  familyId: string | null,
  actor: Actor,
) {
  const [items, setItems] = useState<PantryItem[]>([])

  useEffect(() => {
    if (!familyId) {
      setItems([])
      return
    }
    return repo.subscribe(familyId, setItems)
  }, [repo, familyId])

  const addItem = useCallback(
    (input: NewPantryInput) => {
      if (!familyId) return
      void repo.add(familyId, input, actor)
      void track('pantry_add')
      notifyItemAdded(familyId, 'pantry', input.name, actor)
    },
    [repo, familyId, actor],
  )
  const editItem = useCallback(
    (id: string, changes: EditPantryInput) => {
      void repo.update(id, changes)
      void track('pantry_edit')
    },
    [repo],
  )
  const changeQuantity = useCallback(
    (id: string, delta: number) => void repo.changeQuantity(id, delta),
    [repo],
  )
  const markConsumed = useCallback(
    (id: string) => {
      void repo.markConsumed(id)
      void track('pantry_consume')
    },
    [repo],
  )
  const restore = useCallback(
    (id: string) => {
      void repo.restore(id)
      void track('pantry_restore')
    },
    [repo],
  )

  return { items, addItem, editItem, changeQuantity, markConsumed, restore }
}
