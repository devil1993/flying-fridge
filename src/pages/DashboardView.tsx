import { useTranslation } from 'react-i18next'
import { useAuth } from '../features/auth/authContext'
import { useFamily } from '../features/family/familyContext'
import { useAppNav } from '../features/app/appNav'
import { useTasks } from '../features/tasks/useTasks'
import { taskRepository } from '../features/tasks/taskRepositoryInstance'
import { taskUrgency, partitionForUser } from '../features/tasks/taskLogic'
import { useNotices } from '../features/notices/useNotices'
import { noticeRepository } from '../features/notices/noticeRepositoryInstance'
import { isOnBoard } from '../features/notices/noticeLogic'
import { useLostFound } from '../features/lostfound/useLostFound'
import { lostRepository } from '../features/lostfound/lostRepositoryInstance'
import { isSearching } from '../features/lostfound/lostLogic'
import { usePantry } from '../features/pantry/usePantry'
import { pantryRepository } from '../features/pantry/pantryRepositoryInstance'
import { isInStock } from '../features/pantry/pantryLogic'
import { useQuestions } from '../features/questions/useQuestions'
import { questionRepository } from '../features/questions/questionRepositoryInstance'
import './dashboard.css'

/** A single overview across the family board's modules. */
export default function DashboardView() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const { setActive } = useAppNav()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const { tasks } = useTasks(taskRepository, familyId, actor)
  const { notices } = useNotices(noticeRepository, familyId, actor)
  const { items: lostItems } = useLostFound(lostRepository, familyId, actor)
  const { items: pantryItems } = usePantry(pantryRepository, familyId, actor)
  const { questions } = useQuestions(questionRepository, familyId, actor)

  const now = Date.now()
  const nowDate = new Date(now)
  const { mine } = partitionForUser(tasks, actor.id)
  const openBoard = tasks.filter((tk) => tk.status === 'open').length
  const overdue = tasks.filter((tk) => taskUrgency(tk, nowDate) === 'overdue').length
  const onBoardNotices = notices.filter((n) => isOnBoard(n, now))
  const important = onBoardNotices.filter((n) => n.important).length
  const searching = lostItems.filter(isSearching).length
  const inStock = pantryItems.filter(isInStock).length
  const openQuestions = questions.filter((q) => q.status === 'open').length

  return (
    <section className="module dashboard" aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="module-title">
        {t('dashboard.title')}
      </h1>

      <div className="dash-cards">
        <article className="dash-card">
          <h2>{t('tasks.title')}</h2>
          <p className="dash-stat">
            <strong>{mine.length}</strong> {t('dashboard.tasksMine')}
          </p>
          <p className="dash-sub">
            {t('dashboard.tasksOpen', { count: openBoard })} ·{' '}
            {t('dashboard.tasksOverdue', { count: overdue })}
          </p>
          <button
            type="button"
            className="dash-open"
            onClick={() => setActive('tasks')}
          >
            {t('dashboard.open')}
          </button>
        </article>

        <article className="dash-card">
          <h2>{t('notices.title')}</h2>
          <p className="dash-stat">
            <strong>{onBoardNotices.length}</strong>{' '}
            {t('dashboard.noticesOnBoard')}
          </p>
          <p className="dash-sub">
            {t('dashboard.noticesImportant', { count: important })}
          </p>
          <button
            type="button"
            className="dash-open"
            onClick={() => setActive('notices')}
          >
            {t('dashboard.open')}
          </button>
        </article>

        <article className="dash-card">
          <h2>{t('lostFound.title')}</h2>
          <p className="dash-stat">
            <strong>{searching}</strong> {t('dashboard.lostSearching')}
          </p>
          <button
            type="button"
            className="dash-open"
            onClick={() => setActive('lostFound')}
          >
            {t('dashboard.open')}
          </button>
        </article>

        <article className="dash-card">
          <h2>{t('pantry.title')}</h2>
          <p className="dash-stat">
            <strong>{inStock}</strong> {t('dashboard.pantryInStock')}
          </p>
          <button
            type="button"
            className="dash-open"
            onClick={() => setActive('pantry')}
          >
            {t('dashboard.open')}
          </button>
        </article>

        <article className="dash-card">
          <h2>{t('questions.title')}</h2>
          <p className="dash-stat">
            <strong>{openQuestions}</strong> {t('dashboard.questionsOpen')}
          </p>
          <button
            type="button"
            className="dash-open"
            onClick={() => setActive('questions')}
          >
            {t('dashboard.open')}
          </button>
        </article>
      </div>
    </section>
  )
}
