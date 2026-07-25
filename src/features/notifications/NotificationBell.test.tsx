import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { AppNavContext, type AppNavValue } from '../app/appNav'
import { notificationRepository } from './notificationRepositoryInstance'
import NotificationBell from './NotificationBell'

const noop = async () => {}

function authValue(): AuthContextValue {
  return {
    user: { id: 'u1', name: 'Ana', email: 'ana@example.com' },
    status: 'authenticated',
    signInEmail: noop,
    registerEmail: noop,
    signInGoogle: noop,
    signOut: noop,
  }
}

function familyValue(familyId: string): FamilyContextValue {
  return { status: 'ready', familyId, familyName: 'Fam', members: [] }
}

function renderBell(familyId: string, nav: Partial<AppNavValue> = {}) {
  const navValue: AppNavValue = {
    active: 'dashboard',
    setActive: nav.setActive ?? (() => {}),
  }
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue(familyId)}>
        <AppNavContext.Provider value={navValue}>
          <NotificationBell />
        </AppNavContext.Provider>
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

describe('NotificationBell', () => {
  it('badges notifications from others but not my own', async () => {
    await notificationRepository.add(
      'fam-badge',
      { module: 'tasks', excerpt: 'Buy milk' },
      { id: 'u2', name: 'Bob' },
    )
    await notificationRepository.add(
      'fam-badge',
      { module: 'notices', excerpt: 'Mine' },
      { id: 'u1', name: 'Ana' },
    )
    renderBell('fam-badge')

    const bell = await screen.findByRole('button', {
      name: /Notifications, 1 unread/,
    })
    expect(bell).toBeInTheDocument()
  })

  it('opens the feed and navigates to the item on click', async () => {
    await notificationRepository.add(
      'fam-open',
      { module: 'pantry', excerpt: 'Leftover dal' },
      { id: 'u2', name: 'Bob' },
    )
    const setActive = vi.fn()
    renderBell('fam-open', { setActive })

    fireEvent.click(screen.getByRole('button', { name: /Notifications/ }))
    const item = await screen.findByText('Leftover dal')
    fireEvent.click(item)

    expect(setActive).toHaveBeenCalledWith('pantry')
  })

  it('clears the unread badge once the feed is opened', async () => {
    await notificationRepository.add(
      'fam-read',
      { module: 'questions', excerpt: 'Pizza?' },
      { id: 'u2', name: 'Bob' },
    )
    renderBell('fam-read')

    fireEvent.click(
      await screen.findByRole('button', { name: /Notifications, 1 unread/ }),
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: /1 unread/ }),
      ).not.toBeInTheDocument(),
    )
  })
})
