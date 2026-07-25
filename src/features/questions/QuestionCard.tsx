import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Question } from './types'

interface Props {
  question: Question
  onAnswer: (id: string, text: string) => void
  onClose: (id: string) => void
}

export default function QuestionCard({ question, onAnswer, onClose }: Props) {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return
    onAnswer(question.id, answer.trim())
    setAnswer('')
  }

  return (
    <li className="question-card">
      <div className="question-head">
        <p className="question-text">{question.text}</p>
        <button
          type="button"
          className="question-close"
          onClick={() => onClose(question.id)}
        >
          {t('questions.close')}
        </button>
      </div>

      {question.answers.length > 0 && (
        <ul className="answer-list">
          {question.answers.map((a, i) => (
            <li key={i} className="answer">
              <span className="answer-text">{a.text}</span>{' '}
              <span className="answer-by">
                {t('questions.answerBy', { name: a.byName })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form className="answer-add" onSubmit={submit}>
        <label className="sr-only" htmlFor={`answer-${question.id}`}>
          {t('questions.answerLabel')}
        </label>
        <input
          id={`answer-${question.id}`}
          className="answer-add-input"
          placeholder={t('questions.answerPlaceholder')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit" className="answer-add-submit">
          {t('questions.answerSubmit')}
        </button>
      </form>
    </li>
  )
}
