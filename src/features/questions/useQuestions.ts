import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import { notifyItemAdded } from '../notifications/notify'
import type { Question, NewQuestionInput, Actor } from './types'
import type { QuestionRepository } from './repository'

export function useQuestions(
  repo: QuestionRepository,
  familyId: string | null,
  actor: Actor,
) {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (!familyId) {
      setQuestions([])
      return
    }
    return repo.subscribe(familyId, setQuestions)
  }, [repo, familyId])

  const addQuestion = useCallback(
    (input: NewQuestionInput) => {
      if (!familyId) return
      void repo.add(familyId, input, actor)
      void track('question_add')
      notifyItemAdded(familyId, 'questions', input.text, actor)
    },
    [repo, familyId, actor],
  )
  const addAnswer = useCallback(
    (id: string, text: string) => {
      void repo.addAnswer(id, text, actor)
      void track('question_answer')
    },
    [repo, actor],
  )
  const close = useCallback((id: string) => void repo.close(id), [repo])
  const reopen = useCallback((id: string) => void repo.reopen(id), [repo])

  return { questions, addQuestion, addAnswer, close, reopen }
}
