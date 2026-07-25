import { InMemoryTaskRepository } from './repository'
import type { Task } from './types'

const author = { id: 'u1', name: 'Ana' }

function latest(): { repo: InMemoryTaskRepository; get: () => Task[] } {
  const repo = new InMemoryTaskRepository(() => 1000)
  let seen: Task[] = []
  repo.subscribe('fam', (t) => {
    seen = t
  })
  return { repo, get: () => seen }
}

describe('InMemoryTaskRepository', () => {
  it('adds tasks and notifies subscribers, newest first', async () => {
    const repo = new InMemoryTaskRepository(
      (() => {
        let t = 0
        return () => ++t
      })(),
    )
    const seen: Task[][] = []
    repo.subscribe('fam', (t) => seen.push(t))
    await repo.add('fam', { description: 'first' }, author)
    await repo.add('fam', { description: 'second' }, author)
    const last = seen.at(-1)!
    expect(last.map((t) => t.description)).toEqual(['second', 'first'])
  })

  it('scopes subscriptions to the family', async () => {
    const { repo, get } = latest()
    await repo.add('fam', { description: 'ours' }, author)
    await repo.add('other', { description: 'theirs' }, author)
    expect(get().map((t) => t.description)).toEqual(['ours'])
  })

  it('assigns and releases a task', async () => {
    const { repo, get } = latest()
    await repo.add('fam', { description: 'x' }, author)
    const id = get()[0].id
    await repo.assign(id, { id: 'u2', name: 'Ben' })
    expect(get()[0]).toMatchObject({ assigneeId: 'u2', assigneeName: 'Ben' })
    await repo.assign(id, null)
    expect(get()[0].assigneeId).toBeNull()
  })

  it('updates status and removes', async () => {
    const { repo, get } = latest()
    await repo.add('fam', { description: 'x' }, author)
    const id = get()[0].id
    await repo.setStatus(id, 'done')
    expect(get()[0].status).toBe('done')
    await repo.remove(id)
    expect(get()).toHaveLength(0)
  })

  it('stops notifying after unsubscribe', async () => {
    const repo = new InMemoryTaskRepository(() => 1)
    let count = 0
    const unsub = repo.subscribe('fam', () => {
      count += 1
    })
    const afterSubscribe = count
    unsub()
    await repo.add('fam', { description: 'x' }, author)
    expect(count).toBe(afterSubscribe)
  })
})
