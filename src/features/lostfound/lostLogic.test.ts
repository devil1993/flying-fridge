import { isSearching, daysSince } from './lostLogic'

const DAY = 86_400_000
const NOW = 1_000_000_000_000

describe('lost & found logic', () => {
  it('is on the board only while searching', () => {
    expect(isSearching({ status: 'searching' })).toBe(true)
    expect(isSearching({ status: 'found' })).toBe(false)
    expect(isSearching({ status: 'down' })).toBe(false)
  })

  it('counts whole days since posting, flooring at zero', () => {
    expect(daysSince(NOW, NOW)).toBe(0)
    expect(daysSince(NOW - 3 * DAY, NOW)).toBe(3)
    expect(daysSince(NOW + DAY, NOW)).toBe(0)
  })
})
