import { InMemoryNotificationRepository } from './repository'
import type { AppNotification } from './types'

const bob = { id: 'u2', name: 'Bob' }

function collect(repo: InMemoryNotificationRepository, familyId: string) {
  const seen: AppNotification[][] = []
  const unsub = repo.subscribe(familyId, (items) => seen.push(items))
  return { seen, unsub }
}

describe('InMemoryNotificationRepository', () => {
  it('emits newest-first and scopes to the family', async () => {
    let clock = 1000
    const repo = new InMemoryNotificationRepository(() => (clock += 1000))
    const { seen } = collect(repo, 'famA')

    await repo.add('famA', { module: 'tasks', excerpt: 'Buy milk' }, bob)
    await repo.add('famB', { module: 'notices', excerpt: 'Other family' }, bob)
    await repo.add('famA', { module: 'pantry', excerpt: 'Dal' }, bob)

    const latest = seen[seen.length - 1]
    expect(latest.map((n) => n.excerpt)).toEqual(['Dal', 'Buy milk'])
    expect(latest.every((n) => n.familyId === 'famA')).toBe(true)
  })

  it('carries the actor and module onto each notification', async () => {
    const repo = new InMemoryNotificationRepository(() => 42)
    const { seen } = collect(repo, 'fam')
    await repo.add('fam', { module: 'questions', excerpt: 'Pizza?' }, bob)

    const n = seen[seen.length - 1][0]
    expect(n).toMatchObject({
      module: 'questions',
      excerpt: 'Pizza?',
      actorId: 'u2',
      actorName: 'Bob',
      createdAt: 42,
    })
  })
})
