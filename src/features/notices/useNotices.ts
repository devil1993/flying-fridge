import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import { notifyItemAdded } from '../notifications/notify'
import type { Notice, NewNoticeInput, EditNoticeInput, Actor } from './types'
import type { NoticeRepository } from './repository'

export function useNotices(
  repo: NoticeRepository,
  familyId: string | null,
  actor: Actor,
) {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    if (!familyId) {
      setNotices([])
      return
    }
    return repo.subscribe(familyId, setNotices)
  }, [repo, familyId])

  const addNotice = useCallback(
    (input: NewNoticeInput) => {
      if (!familyId) return
      void repo.add(familyId, input, actor)
      void track('notice_add')
      notifyItemAdded(familyId, 'notices', input.text, actor)
    },
    [repo, familyId, actor],
  )

  const editNotice = useCallback(
    (id: string, changes: EditNoticeInput) => {
      void repo.update(id, changes)
      void track('notice_edit')
    },
    [repo],
  )
  const setImportant = useCallback(
    (id: string, important: boolean) => void repo.setImportant(id, important),
    [repo],
  )
  const setPermanent = useCallback(
    (id: string, permanent: boolean) => void repo.setPermanent(id, permanent),
    [repo],
  )
  const takeDown = useCallback(
    (id: string) => {
      void repo.takeDown(id)
      void track('notice_takedown')
    },
    [repo],
  )
  const restore = useCallback(
    (id: string) => {
      void repo.restore(id)
      void track('notice_restore')
    },
    [repo],
  )

  return {
    notices,
    addNotice,
    editNotice,
    setImportant,
    setPermanent,
    takeDown,
    restore,
  }
}
