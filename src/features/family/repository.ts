import type { Family } from './familyContext'

export interface FamilyRepository {
  /** Subscribe to the families the given user belongs to. Returns unsubscribe. */
  subscribeMine(uid: string, onChange: (families: Family[]) => void): () => void
}

/**
 * In-memory family repo for offline dev + tests: puts every signed-in user into
 * a single local "Demo Family" so the app is usable without a real backend.
 */
export class InMemoryFamilyRepository implements FamilyRepository {
  subscribeMine(uid: string, onChange: (families: Family[]) => void): () => void {
    onChange([
      {
        id: 'demo-family',
        name: 'Demo Family',
        memberUids: [uid],
        members: [{ uid, name: 'You', email: null }],
      },
    ])
    return () => {}
  }
}
