import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useTasks } from './useTasks'
import { partitionForUser } from './taskLogic'
import TaskCard from './TaskCard'
import { taskRepository } from './taskRepositoryInstance'
import type { Task } from './types'
import type { TaskRepository } from './repository'
import './tasks.css'

export default function TasksDashboard({
  repository = taskRepository,
}: {
  repository?: TaskRepository
}) {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const { familyId, familyName, leave } = useFamily()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const { tasks, addTask, assignToSelf, release, setDone, remove } = useTasks(
    repository,
    familyId,
    actor,
  )
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')

  const { mine, board } = partitionForUser(tasks, actor.id)

  function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!desc.trim()) return
    addTask({ description: desc.trim(), targetDate: date || null })
    setDesc('')
    setDate('')
  }

  const renderList = (list: Task[]) =>
    list.length === 0 ? (
      <p className="task-empty">{t('tasks.empty')}</p>
    ) : (
      <ul className="task-list">
        {list.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUserId={actor.id}
            onAssignSelf={assignToSelf}
            onRelease={release}
            onToggleDone={setDone}
            onRemove={remove}
          />
        ))}
      </ul>
    )

  return (
    <main id="main-content" className="dash">
      <div className="dash-wrap">
        <header className="dash-head">
          <h1>{t('tasks.title')}</h1>
          <div className="dash-actions">
            <span className="dash-family">
              {t('tasks.family.current', { name: familyName ?? familyId })}
            </span>
            <button type="button" className="dash-link" onClick={leave}>
              {t('tasks.family.leave')}
            </button>
            <button
              type="button"
              className="dash-link"
              onClick={() => void signOut()}
            >
              {t('auth.signOut')}
            </button>
          </div>
        </header>

        <form className="task-add" onSubmit={onAdd}>
          <label className="sr-only" htmlFor="task-desc">
            {t('tasks.add.descriptionLabel')}
          </label>
          <input
            id="task-desc"
            className="task-add-desc"
            placeholder={t('tasks.add.descriptionPlaceholder')}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            id="task-date"
            className="task-add-date"
            type="date"
            aria-label={t('tasks.add.dateLabel')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit" className="task-add-submit">
            {t('tasks.add.submit')}
          </button>
        </form>

        <section aria-labelledby="tasks-mine" className="task-section">
          <h2 id="tasks-mine">{t('tasks.mine')}</h2>
          {renderList(mine)}
        </section>

        <section aria-labelledby="tasks-board" className="task-section">
          <h2 id="tasks-board">{t('tasks.board')}</h2>
          {renderList(board)}
        </section>
      </div>
    </main>
  )
}
