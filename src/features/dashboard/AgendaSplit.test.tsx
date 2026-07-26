import { render, screen, fireEvent } from '@testing-library/react'
import '../../i18n/config'
import { AppNavContext, type AppNavValue } from '../app/appNav'
import AgendaSplit from './AgendaSplit'
import { toIsoDate, type AgendaItem } from './agenda'

const todayIso = toIsoDate(new Date())

const items: AgendaItem[] = [
  { id: 'tasks:1', type: 'tasks', title: 'Buy milk today', date: todayIso },
  { id: 'lostFound:1', type: 'lostFound', title: 'Lost keys', date: null },
]

function renderSplit(setActive = () => {}) {
  const nav: AppNavValue = { active: 'dashboard', setActive }
  return render(
    <AppNavContext.Provider value={nav}>
      <AgendaSplit items={items} />
    </AppNavContext.Provider>,
  )
}

describe('AgendaSplit', () => {
  it('shows recent items by default, undated ones included', () => {
    renderSplit()
    expect(screen.getByText('Buy milk today')).toBeInTheDocument()
    expect(screen.getByText('Lost keys')).toBeInTheDocument() // undated, at bottom
  })

  it('switches to the calendar tab', () => {
    renderSplit()
    fireEvent.click(screen.getByRole('tab', { name: 'Calendar' }))
    // The month grid is present (a row of weekday column headers).
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
  })

  it('opening another day focuses recent and offers back-to-today', () => {
    renderSplit()
    fireEvent.click(screen.getByRole('tab', { name: 'Calendar' }))

    const otherDay = new Date().getDate() === 15 ? '16' : '15'
    fireEvent.click(screen.getByRole('button', { name: otherDay }))

    // Back on the recent view, focused on a non-today date.
    const back = screen.getByRole('button', { name: 'Back to today' })
    expect(back).toBeInTheDocument()

    fireEvent.click(back)
    expect(
      screen.queryByRole('button', { name: 'Back to today' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Buy milk today')).toBeInTheDocument()
  })

  it('clicking an item navigates to its module', () => {
    const setActive = vi.fn()
    renderSplit(setActive)
    fireEvent.click(screen.getByText('Buy milk today'))
    expect(setActive).toHaveBeenCalledWith('tasks')
  })
})
