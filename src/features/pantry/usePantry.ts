import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import type { PantryItem, NewPantryInput, Actor } from './types'
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
    },
    [repo, familyId, actor],
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

  return { items, addItem, changeQuantity, markConsumed }
}
