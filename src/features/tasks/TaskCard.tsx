import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { taskUrgency } from './taskLogic'
import { URGENCY_COLOR, formatTargetDate } from './urgency'
import type { Task, EditTaskInput } from './types'

interface Props {
  task: Task
  currentUserId: string
  onAssignSelf: (id: string) => void
  onRelease: (id: string) => void
  onToggleDone: (id: string, done: boolean) => void
  onEdit: (id: string, changes: EditTaskInput) => void
  onRemove: (id: string) => void
}

export default function TaskCard({
  task,
  currentUserId,
  onAssignSelf,
  onRelease,
  onToggleDone,
  onEdit,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const urgency = taskUrgency(task, new Date())
  const done = task.status === 'done'
  const mine = task.assigneeId === currentUserId

  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(task.description)
  const [date, setDate] = useState(task.targetDate ?? '')

  function startEdit() {
    setDesc(task.description)
    setDate(task.targetDate ?? '')
    setEditing(true)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!desc.trim()) return
    onEdit(task.id, { description: desc.trim(), targetDate: date || null })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="task-card" style={{ borderLeftColor: URGENCY_COLOR[urgency] }}>
        <form className="task-edit" onSubmit={save}>
          <input
            className="task-add-desc"
            aria-label={t('tasks.edit.descriptionLabel')}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            className="task-add-date"
            type="date"
            aria-label={t('tasks.edit.dateLabel')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="task-actions">
            <button type="submit" disabled={!desc.trim()}>
              {t('tasks.edit.save')}
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              {t('tasks.edit.cancel')}
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="task-card" style={{ borderLeftColor: URGENCY_COLOR[urgency] }}>
      <div className="task-main">
        <p className={done ? 'task-desc task-desc--done' : 'task-desc'}>
          {task.description}
        </p>
        <div className="task-meta">
          {task.targetDate ? (
            <span className="task-date" style={{ color: URGENCY_COLOR[urgency] }}>
              {t('tasks.targetDate', { date: formatTargetDate(task.targetDate) })}
              {urgency !== 'none' ? ` · ${t(`tasks.urgency.${urgency}`)}` : ''}
            </span>
          ) : (
            <span className="task-date task-date--none">{t('tasks.noDate')}</span>
          )}
          <span className="task-assignee">
            {task.assigneeId
              ? t('tasks.assignedTo', { name: task.assigneeName })
              : t('tasks.unassigned')}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {!done && !task.assigneeId && (
          <button type="button" onClick={() => onAssignSelf(task.id)}>
            {t('tasks.assignToMe')}
          </button>
        )}
        {!done && mine && (
          <button type="button" onClick={() => onRelease(task.id)}>
            {t('tasks.release')}
          </button>
        )}
        <button type="button" onClick={() => onToggleDone(task.id, !done)}>
          {done ? t('tasks.markOpen') : t('tasks.markDone')}
        </button>
        <button type="button" onClick={startEdit}>
          {t('tasks.edit.action')}
        </button>
        <button
          type="button"
          className="task-remove"
          aria-label={t('tasks.remove')}
          onClick={() => onRemove(task.id)}
        >
          ×
        </button>
      </div>
    </li>
  )
}
