import type { Question, NewQuestionInput, Actor } from './types'

export interface QuestionRepository {
  subscribe(familyId: string, onChange: (questions: Question[]) => void): () => void
  add(familyId: string, input: NewQuestionInput, author: Actor): Promise<void>
  addAnswer(questionId: string, text: string, author: Actor): Promise<void>
  close(questionId: string): Promise<void>
  reopen(questionId: string): Promise<void>
  remove(questionId: string): Promise<void>
}

export class InMemoryQuestionRepository implements QuestionRepository {
  private questions = new Map<string, Question>()
  private listeners = new Set<(questions: Question[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): Question[] {
    return [...this.questions.values()].sort((a, b) => b.createdAt - a.createdAt)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  subscribe(familyId: string, onChange: (questions: Question[]) => void): () => void {
    const listener = (questions: Question[]) =>
      onChange(questions.filter((q) => q.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(familyId: string, input: NewQuestionInput, author: Actor): Promise<void> {
    const ts = this.now()
    const id = `question-${++this.seq}`
    this.questions.set(id, {
      id,
      familyId,
      text: input.text,
      answers: [],
      status: 'open',
      createdBy: author.id,
      createdByName: author.name,
      createdAt: ts,
      updatedAt: ts,
    })
    this.emit()
    return Promise.resolve()
  }

  addAnswer(questionId: string, text: string, author: Actor): Promise<void> {
    const question = this.questions.get(questionId)
    if (question) {
      question.answers.push({
        text,
        byId: author.id,
        byName: author.name,
        at: this.now(),
      })
      question.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }

  private setStatus(questionId: string, status: Question['status']): void {
    const question = this.questions.get(questionId)
    if (question) {
      question.status = status
      question.updatedAt = this.now()
      this.emit()
    }
  }

  close(questionId: string): Promise<void> {
    this.setStatus(questionId, 'closed')
    return Promise.resolve()
  }

  reopen(questionId: string): Promise<void> {
    this.setStatus(questionId, 'open')
    return Promise.resolve()
  }

  remove(questionId: string): Promise<void> {
    if (this.questions.delete(questionId)) this.emit()
    return Promise.resolve()
  }
}
