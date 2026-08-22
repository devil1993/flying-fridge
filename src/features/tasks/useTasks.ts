import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import { notifyItemAdded } from '../notifications/notify'
import type { Task, NewTaskInput, EditTaskInput, Actor } from './types'
import type { TaskRepository } from './repository'

/**
 * Subscribes to a family's tasks and exposes the mutating actions. The UI stays
 * backend-agnostic — it only sees this hook and the repository interface.
 */
export function useTasks(
  repo: TaskRepository,
  familyId: string | null,
  actor: Actor,
) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!familyId) {
      setTasks([])
      return
    }
    return repo.subscribe(familyId, setTasks)
  }, [repo, familyId])

  const addTask = useCallback(
    (input: NewTaskInput) => {
      if (!familyId) return
      void repo.add(familyId, input, actor)
      void track('task_add')
      notifyItemAdded(familyId, 'tasks', input.description, actor)
    },
    [repo, familyId, actor],
  )

  const editTask = useCallback(
    (taskId: string, changes: EditTaskInput) => {
      void repo.update(taskId, changes)
      void track('task_edit')
    },
    [repo],
  )

  const assignToSelf = useCallback(
    (taskId: string) => {
      void repo.assign(taskId, actor)
      void track('task_assign')
    },
    [repo, actor],
  )

  const release = useCallback(
    (taskId: string) => {
      void repo.assign(taskId, null)
    },
    [repo],
  )

  const setDone = useCallback(
    (taskId: string, done: boolean) => {
      // Completing a task claims it: whoever finishes it becomes the assignee,
      // so "who did this?" always has an answer. Reopening leaves it be.
      if (done) void repo.assign(taskId, actor)
      void repo.setStatus(taskId, done ? 'done' : 'open')
      if (done) void track('task_complete')
    },
    [repo, actor],
  )

  const remove = useCallback(
    (taskId: string) => {
      void repo.remove(taskId)
    },
    [repo],
  )

  return { tasks, addTask, editTask, assignToSelf, release, setDone, remove }
}
