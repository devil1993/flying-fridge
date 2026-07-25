import type { PantryItem, NewPantryInput, Actor } from './types'

export interface PantryRepository {
  subscribe(familyId: string, onChange: (items: PantryItem[]) => void): () => void
  add(familyId: string, input: NewPantryInput, author: Actor): Promise<void>
  /** Adjust quantity by delta (clamped at 0). */
  changeQuantity(itemId: string, delta: number): Promise<void>
  markConsumed(itemId: string): Promise<void>
  remove(itemId: string): Promise<void>
}

export class InMemoryPantryRepository implements PantryRepository {
  private items = new Map<string, PantryItem>()
  private listeners = new Set<(items: PantryItem[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): PantryItem[] {
    return [...this.items.values()].sort((a, b) => b.createdAt - a.createdAt)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  subscribe(familyId: string, onChange: (items: PantryItem[]) => void): () => void {
    const listener = (items: PantryItem[]) =>
      onChange(items.filter((i) => i.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(familyId: string, input: NewPantryInput, author: Actor): Promise<void> {
    const ts = this.now()
    const id = `pantry-${++this.seq}`
    this.items.set(id, {
      id,
      familyId,
      name: input.name,
      madeOn: input.madeOn ?? null,
      keepsDays: input.keepsDays ?? null,
      quantity: input.quantity ?? 1,
      status: 'instock',
      createdBy: author.id,
      createdByName: author.name,
      createdAt: ts,
      updatedAt: ts,
    })
    this.emit()
    return Promise.resolve()
  }

  changeQuantity(itemId: string, delta: number): Promise<void> {
    const item = this.items.get(itemId)
    if (item) {
      item.quantity = Math.max(0, item.quantity + delta)
      item.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }

  markConsumed(itemId: string): Promise<void> {
    const item = this.items.get(itemId)
    if (item) {
      item.status = 'consumed'
      item.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }

  remove(itemId: string): Promise<void> {
    if (this.items.delete(itemId)) this.emit()
    return Promise.resolve()
  }
}
