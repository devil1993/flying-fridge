export type TaskStatus = 'open' | 'done'

/** A task on a family's board. Persisted (timelined) even once done. */
export interface Task {
  id: string
  familyId: string
  description: string
  /** ISO calendar date (yyyy-mm-dd) the task is targeted for, or null. */
  targetDate: string | null
  /** Who claimed it, if anyone. */
  assigneeId: string | null
  assigneeName: string | null
  status: TaskStatus
  /** Soft-delete marker: removed from the board but never destroyed. */
  deleted?: boolean
  createdBy: string
  createdAt: number
  updatedAt: number
}

export interface NewTaskInput {
  description: string
  targetDate?: string | null
}

/** The author-editable fields of a task (correcting a mistake). */
export interface EditTaskInput {
  description: string
  targetDate: string | null
}

export interface Actor {
  id: string
  name: string
}
