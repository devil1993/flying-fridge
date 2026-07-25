import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDb } from '../../lib/firebase'
import type { Family, FamilyMember } from './familyContext'
import type { FamilyRepository } from './repository'

const COLLECTION = 'families'

function toFamily(snap: QueryDocumentSnapshot<DocumentData>): Family {
  const d = snap.data()
  const memberUids: string[] = Array.isArray(d.memberUids) ? d.memberUids : []
  const rawMembers = (d.members as Record<string, { name?: string; email?: string }>) ?? {}
  const members: FamilyMember[] = memberUids.map((uid) => ({
    uid,
    name: rawMembers[uid]?.name ?? uid,
    email: rawMembers[uid]?.email ?? null,
  }))
  return {
    id: snap.id,
    name: d.name ?? 'Family',
    memberUids,
    members,
  }
}

/**
 * Firestore-backed family repo. A user's families are those whose `memberUids`
 * array contains their uid. Families are bootstrapped manually in the console
 * for now (see human-instructions/03).
 */
export const firestoreFamilyRepository: FamilyRepository = {
  subscribeMine(uid, onChange) {
    const q = query(
      collection(getDb(), COLLECTION),
      where('memberUids', 'array-contains', uid),
    )
    return onSnapshot(
      q,
      (qs) => onChange(qs.docs.map(toFamily)),
      (err) => {
        // Don't hang on "Loading…": surface the error and fall back to "no
        // family". Most common cause: Security Rules not published, or the
        // family doc's array field isn't named `memberUids`.
        console.error(
          '[family] could not read families — check that firestore.rules is ' +
            'published and the family doc has a `memberUids` array:',
          err,
        )
        onChange([])
      },
    )
  },
}
