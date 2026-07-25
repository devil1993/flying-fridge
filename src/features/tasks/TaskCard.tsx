import { useTranslation } from 'react-i18next'
import { taskUrgency } from './taskLogic'
import { URGENCY_COLOR, formatTargetDate } from './urgency'
import type { Task } from './types'

interface Props {
  task: Task
  currentUserId: string
  onAssignSelf: (id: string) => void
  onRelease: (id: string) => void
  onToggleDone: (id: string, done: boolean) => void
  onRemove: (id: string) => void
}

export default function TaskCard({
  task,
  currentUserId,
  onAssignSelf,
  onRelease,
  onToggleDone,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const urgency = taskUrgency(task, new Date())
  const done = task.status === 'done'
  const mine = task.assigneeId === currentUserId

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
