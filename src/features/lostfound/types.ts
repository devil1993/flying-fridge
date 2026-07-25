export type LostStatus = 'searching' | 'found' | 'down'

/** Something a family member is looking for. Kept (timelined) once resolved. */
export interface LostItem {
  id: string
  familyId: string
  description: string
  status: LostStatus
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

export interface NewLostInput {
  description: string
}

export interface Actor {
  id: string
  name: string
}
