import { cx } from './cx'

describe('cx', () => {
  it('joins truthy parts and drops falsy ones', () => {
    expect(cx('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, null, undefined)).toBe('')
  })

  it('preserves order', () => {
    expect(cx('one', 'two', 'three')).toBe('one two three')
  })
})
