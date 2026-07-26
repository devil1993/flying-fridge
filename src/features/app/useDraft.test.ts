import { renderHook, act } from '@testing-library/react'
import { useDraft } from './useDraft'

describe('useDraft', () => {
  beforeEach(() => localStorage.clear())

  it('restores a persisted draft on mount (survives navigation)', () => {
    localStorage.setItem('ff.draft.k1', 'half-typed note')
    const { result } = renderHook(() => useDraft('k1'))
    expect(result.current[0]).toBe('half-typed note')
  })

  it('persists on change and removes on clear', () => {
    const { result } = renderHook(() => useDraft('k2'))
    act(() => result.current[1]('buy milk'))
    expect(result.current[0]).toBe('buy milk')
    expect(localStorage.getItem('ff.draft.k2')).toBe('buy milk')

    act(() => result.current[2]())
    expect(result.current[0]).toBe('')
    expect(localStorage.getItem('ff.draft.k2')).toBeNull()
  })

  it('uses the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useDraft('k3', '1'))
    expect(result.current[0]).toBe('1')
  })
})
