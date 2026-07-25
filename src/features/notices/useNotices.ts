import { useCallback, useEffect, useState } from 'react'
import { track } from '../../lib/firebase'
import type { Notice, NewNoticeInput, Actor } from './types'
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
    },
    [repo, familyId, actor],
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

  return { notices, addNotice, setImportant, setPermanent, takeDown }
}
