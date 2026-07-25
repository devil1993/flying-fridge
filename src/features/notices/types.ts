export type NoticeStatus = 'up' | 'down'

/** A notice on the family board. Kept (timelined) even after it leaves the board. */
export interface Notice {
  id: string
  familyId: string
  text: string
  /** Adds a colour highlight. */
  important: boolean
  /** Stays up until pulled down (otherwise expires after ~1 month). */
  permanent: boolean
  /** 'down' = taken off the board by someone (still persisted). */
  status: NoticeStatus
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

export interface NewNoticeInput {
  text: string
  important?: boolean
  permanent?: boolean
}

export interface Actor {
  id: string
  name: string
}
