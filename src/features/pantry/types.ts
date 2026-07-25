export type PantryStatus = 'instock' | 'consumed'

/** A food item in the family pantry. Kept (timelined) after it's consumed. */
export interface PantryItem {
  id: string
  familyId: string
  name: string
  /** When it was made (ISO yyyy-mm-dd), or null. */
  madeOn: string | null
  /** How many days it's likely to stay good, or null. */
  keepsDays: number | null
  /** Approximate quantity on hand. */
  quantity: number
  status: PantryStatus
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

export interface NewPantryInput {
  name: string
  madeOn?: string | null
  keepsDays?: number | null
  quantity?: number
}

export interface Actor {
  id: string
  name: string
}
