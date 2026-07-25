export interface Answer {
  text: string
  byId: string
  byName: string
  at: number
}

export type QuestionStatus = 'open' | 'closed'

/** An open question for the family. Kept (timelined) once closed. */
export interface Question {
  id: string
  familyId: string
  text: string
  answers: Answer[]
  status: QuestionStatus
  createdBy: string
  createdByName: string
  createdAt: number
  updatedAt: number
}

export interface NewQuestionInput {
  text: string
}

export interface Actor {
  id: string
  name: string
}
