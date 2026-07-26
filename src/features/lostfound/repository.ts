import type { LostItem, NewLostInput, Actor } from './types'

export interface LostRepository {
  subscribe(familyId: string, onChange: (items: LostItem[]) => void): () => void
  add(familyId: string, input: NewLostInput, author: Actor): Promise<void>
  markFound(itemId: string): Promise<void>
  takeDown(itemId: string): Promise<void>
  /** Bring a found/taken-down item back to the board (undo). */
  restore(itemId: string): Promise<void>
  remove(itemId: string): Promise<void>
}

export class InMemoryLostRepository implements LostRepository {
  private items = new Map<string, LostItem>()
  private listeners = new Set<(items: LostItem[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): LostItem[] {
    return [...this.items.values()].sort((a, b) => b.createdAt - a.createdAt)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  subscribe(familyId: string, onChange: (items: LostItem[]) => void): () => void {
    const listener = (items: LostItem[]) =>
      onChange(items.filter((i) => i.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(familyId: string, input: NewLostInput, author: Actor): Promise<void> {
    const ts = this.now()
    const id = `lost-${++this.seq}`
    this.items.set(id, {
      id,
      familyId,
      description: input.description,
      status: 'searching',
      createdBy: author.id,
      createdByName: author.name,
      createdAt: ts,
      updatedAt: ts,
    })
    this.emit()
    return Promise.resolve()
  }

  private setStatus(itemId: string, status: LostItem['status']): void {
    const item = this.items.get(itemId)
    if (item) {
      item.status = status
      item.updatedAt = this.now()
      this.emit()
    }
  }

  markFound(itemId: string): Promise<void> {
    this.setStatus(itemId, 'found')
    return Promise.resolve()
  }

  takeDown(itemId: string): Promise<void> {
    this.setStatus(itemId, 'down')
    return Promise.resolve()
  }

  restore(itemId: string): Promise<void> {
    this.setStatus(itemId, 'searching')
    return Promise.resolve()
  }

  remove(itemId: string): Promise<void> {
    if (this.items.delete(itemId)) this.emit()
    return Promise.resolve()
  }
}
