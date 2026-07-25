import { isInStock, freshnessDaysLeft } from './pantryLogic'

const NOW = new Date(2026, 6, 26).getTime() // 2026-07-26 local

describe('pantry logic', () => {
  it('is on the list until consumed', () => {
    expect(isInStock({ status: 'instock' })).toBe(true)
    expect(isInStock({ status: 'consumed' })).toBe(false)
  })

  it('returns null freshness when made-date or shelf life is unknown', () => {
    expect(freshnessDaysLeft({ madeOn: null, keepsDays: 5 }, NOW)).toBeNull()
    expect(freshnessDaysLeft({ madeOn: '2026-07-20', keepsDays: null }, NOW)).toBeNull()
  })

  it('computes days left from made-date + shelf life', () => {
    // made 2026-07-20, keeps 10 days -> good until 07-30 -> 4 days left on 07-26
    expect(freshnessDaysLeft({ madeOn: '2026-07-20', keepsDays: 10 }, NOW)).toBe(4)
    // made 2026-07-20, keeps 3 days -> expired
    expect(
      freshnessDaysLeft({ madeOn: '2026-07-20', keepsDays: 3 }, NOW),
    ).toBeLessThan(0)
  })
})

describe('InMemoryPantryRepository quantity', () => {
  it('clamps quantity at zero', async () => {
    const { InMemoryPantryRepository } = await import('./repository')
    const repo = new InMemoryPantryRepository(() => 1)
    let items: { id: string; quantity: number }[] = []
    repo.subscribe('fam', (i) => (items = i))
    await repo.add('fam', { name: 'Milk', quantity: 1 }, { id: 'u', name: 'A' })
    const id = items[0].id
    await repo.changeQuantity(id, -5)
    expect(items[0].quantity).toBe(0)
    await repo.changeQuantity(id, 2)
    expect(items[0].quantity).toBe(2)
  })
})
