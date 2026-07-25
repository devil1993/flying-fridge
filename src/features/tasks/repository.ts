import type { Task, NewTaskInput, TaskStatus, Actor } from './types'

/**
 * Persistence boundary for tasks. The UI depends only on this interface, so it
 * can run against the in-memory implementation in tests and the Firestore one
 * in the app. See ADR-0002 (Firebase) and the repository pattern in the design
 * docs.
 */
export interface TaskRepository {
  /** Subscribe to a family's tasks (newest first). Returns an unsubscribe fn. */
  subscribe(familyId: string, onChange: (tasks: Task[]) => void): () => void
  add(familyId: string, input: NewTaskInput, author: Actor): Promise<void>
  /** Claim/unclaim: pass an actor to assign, or null to release. */
  assign(taskId: string, user: Actor | null): Promise<void>
  setStatus(taskId: string, status: TaskStatus): Promise<void>
  remove(taskId: string): Promise<void>
}

/**
 * In-memory TaskRepository for tests and offline development. Deterministic ids
 * and a clock injectable for stable assertions.
 */
export class InMemoryTaskRepository implements TaskRepository {
  private tasks = new Map<string, Task>()
  private listeners = new Set<(tasks: Task[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): Task[] {
    return [...this.tasks.values()]
      .filter((t) => !t.deleted)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  subscribe(familyId: string, onChange: (tasks: Task[]) => void): () => void {
    const listener = (tasks: Task[]) =>
      onChange(tasks.filter((t) => t.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(familyId: string, input: NewTaskInput, author: Actor): Promise<void> {
    const ts = this.now()
    const id = `task-${++this.seq}`
    this.tasks.set(id, {
      id,
      familyId,
      description: input.description,
      targetDate: input.targetDate ?? null,
      assigneeId: null,
      assigneeName: null,
      status: 'open',
      createdBy: author.id,
      createdAt: ts,
      updatedAt: ts,
    })
    this.emit()
    return Promise.resolve()
  }

  assign(taskId: string, user: Actor | null): Promise<void> {
    const task = this.tasks.get(taskId)
    if (task) {
      task.assigneeId = user?.id ?? null
      task.assigneeName = user?.name ?? null
      task.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }

  setStatus(taskId: string, status: TaskStatus): Promise<void> {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = status
      task.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }

  remove(taskId: string): Promise<void> {
    // Soft delete: keep the record, just take it off the board (ADR-0013).
    const task = this.tasks.get(taskId)
    if (task && !task.deleted) {
      task.deleted = true
      task.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }
}
