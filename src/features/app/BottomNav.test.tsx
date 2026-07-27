import { render, screen, fireEvent } from '@testing-library/react'
import '../../i18n/config'
import { AppNavContext, type AppNavValue } from './appNav'
import BottomNav from './BottomNav'

function renderNav(nav: Partial<AppNavValue> = {}) {
  const value: AppNavValue = {
    active: nav.active ?? 'dashboard',
    setActive: nav.setActive ?? (() => {}),
  }
  return render(
    <AppNavContext.Provider value={value}>
      <BottomNav />
    </AppNavContext.Provider>,
  )
}

describe('BottomNav', () => {
  it('shows the six content boards as icon tabs (no Settings)', () => {
    renderNav()
    for (const name of [
      'Dashboard',
      'Tasks',
      'Notices',
      'Lost & Found',
      'Pantry',
      'Questions',
    ]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('marks the active module and switches on tap', () => {
    const setActive = vi.fn()
    renderNav({ active: 'tasks', setActive })

    expect(screen.getByRole('button', { name: 'Tasks' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Notices' }))
    expect(setActive).toHaveBeenCalledWith('notices')
  })
})
