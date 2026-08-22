import type { Notice, NewNoticeInput, EditNoticeInput, Actor } from './types'

export interface NoticeRepository {
  subscribe(familyId: string, onChange: (notices: Notice[]) => void): () => void
  add(familyId: string, input: NewNoticeInput, author: Actor): Promise<void>
  /** Correct the author-entered fields (text, date). */
  update(noticeId: string, changes: EditNoticeInput): Promise<void>
  setImportant(noticeId: string, important: boolean): Promise<void>
  setPermanent(noticeId: string, permanent: boolean): Promise<void>
  /** Take a notice off the board (kept/timelined). */
  takeDown(noticeId: string): Promise<void>
  /** Put a taken-down notice back on the board (undo). */
  restore(noticeId: string): Promise<void>
  remove(noticeId: string): Promise<void>
}

/** In-memory NoticeRepository for tests and offline development. */
export class InMemoryNoticeRepository implements NoticeRepository {
  private notices = new Map<string, Notice>()
  private listeners = new Set<(notices: Notice[]) => void>()
  private seq = 0
  private readonly now: () => number

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private snapshot(): Notice[] {
    return [...this.notices.values()]
      .filter((n) => !n.deleted)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  private emit(): void {
    const snap = this.snapshot()
    for (const listener of this.listeners) listener(snap)
  }

  /** Bulk-load fully-formed records (used to seed demo mode). */
  seed(items: Notice[]): void {
    for (const it of items) this.notices.set(it.id, it)
    this.emit()
  }

  subscribe(familyId: string, onChange: (notices: Notice[]) => void): () => void {
    const listener = (notices: Notice[]) =>
      onChange(notices.filter((n) => n.familyId === familyId))
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(familyId: string, input: NewNoticeInput, author: Actor): Promise<void> {
    const ts = this.now()
    const id = `notice-${++this.seq}`
    this.notices.set(id, {
      id,
      familyId,
      text: input.text,
      date: input.date ?? null,
      important: input.important ?? false,
      permanent: input.permanent ?? false,
      status: 'up',
      createdBy: author.id,
      createdByName: author.name,
      createdAt: ts,
      updatedAt: ts,
    })
    this.emit()
    return Promise.resolve()
  }

  private patch(noticeId: string, change: Partial<Notice>): void {
    const notice = this.notices.get(noticeId)
    if (notice) {
      Object.assign(notice, change, { updatedAt: this.now() })
      this.emit()
    }
  }

  update(noticeId: string, changes: EditNoticeInput): Promise<void> {
    this.patch(noticeId, { text: changes.text, date: changes.date })
    return Promise.resolve()
  }

  setImportant(noticeId: string, important: boolean): Promise<void> {
    this.patch(noticeId, { important })
    return Promise.resolve()
  }

  setPermanent(noticeId: string, permanent: boolean): Promise<void> {
    this.patch(noticeId, { permanent })
    return Promise.resolve()
  }

  takeDown(noticeId: string): Promise<void> {
    this.patch(noticeId, { status: 'down' })
    return Promise.resolve()
  }

  restore(noticeId: string): Promise<void> {
    this.patch(noticeId, { status: 'up' })
    return Promise.resolve()
  }

  remove(noticeId: string): Promise<void> {
    // Soft delete: keep the record, just take it off the board (ADR-0013).
    const notice = this.notices.get(noticeId)
    if (notice && !notice.deleted) {
      notice.deleted = true
      notice.updatedAt = this.now()
      this.emit()
    }
    return Promise.resolve()
  }
}
