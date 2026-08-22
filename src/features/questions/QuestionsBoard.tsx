import { type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useDraft } from '../app/useDraft'
import RecentlyClosed from '../app/RecentlyClosed'
import { useQuestions } from './useQuestions'
import QuestionCard from './QuestionCard'
import { questionRepository } from './questionRepositoryInstance'
import type { QuestionRepository } from './repository'
import './questions.css'

export default function QuestionsBoard({
  repository = questionRepository,
}: {
  repository?: QuestionRepository
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const actor = { id: user?.id ?? '', name: user?.name ?? '' }

  const { questions, addQuestion, editQuestion, addAnswer, close, reopen } =
    useQuestions(repository, familyId, actor)
  const [text, setText, clearText] = useDraft('questions.text')
  const open = questions.filter((q) => q.status === 'open')
  const closed = questions
    .filter((q) => q.status === 'closed')
    .map((q) => ({ id: q.id, title: q.text, updatedAt: q.updatedAt }))

  function onAsk(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addQuestion({ text: text.trim() })
    clearText()
  }

  return (
    <section className="module questions" aria-labelledby="questions-heading">
      <h1 id="questions-heading" className="module-title">
        {t('questions.title')}
      </h1>

      <form className="question-ask" onSubmit={onAsk}>
        <label className="sr-only" htmlFor="question-text">
          {t('questions.add.label')}
        </label>
        <input
          id="question-text"
          className="question-ask-input"
          placeholder={t('questions.add.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="question-ask-submit">
          {t('questions.add.submit')}
        </button>
      </form>

      {open.length === 0 ? (
        <p className="task-empty">{t('questions.empty')}</p>
      ) : (
        <ul className="question-list">
          {open.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onAnswer={addAnswer}
              onEdit={editQuestion}
              onClose={close}
            />
          ))}
        </ul>
      )}

      <RecentlyClosed entries={closed} onRestore={reopen} />
    </section>
  )
}
