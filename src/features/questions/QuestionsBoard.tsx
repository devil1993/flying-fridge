import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
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

  const { questions, addQuestion, addAnswer, close } = useQuestions(
    repository,
    familyId,
    actor,
  )
  const [text, setText] = useState('')
  const open = questions.filter((q) => q.status === 'open')

  function onAsk(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addQuestion({ text: text.trim() })
    setText('')
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
              onClose={close}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
