import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { FamilyProvider } from '../family/FamilyProvider'
import { AppNavProvider } from '../app/AppNavProvider'
import { InMemoryTaskRepository } from './repository'
import TasksDashboard from './TasksDashboard'
import AppHome from '../../pages/AppHome'

const noop = async () => {}

function authValue(): AuthContextValue {
  return {
    user: { id: 'u1', name: 'Ana', email: null },
    status: 'authenticated',
    signInEmail: noop,
    registerEmail: noop,
    signInGoogle: noop,
    signOut: noop,
  }
}

function familyValue(): FamilyContextValue {
  return { status: 'ready', familyId: 'fam', familyName: 'Fam', members: [] }
}

describe('TasksDashboard', () => {
  it('adds a task, self-assigns it, then marks it done', () => {
    const repo = new InMemoryTaskRepository()
    render(
      <AuthContext.Provider value={authValue()}>
        <FamilyContext.Provider value={familyValue()}>
          <TasksDashboard repository={repo} />
        </FamilyContext.Provider>
      </AuthContext.Provider>,
    )

    fireEvent.change(screen.getByLabelText(/what needs doing/i), {
      target: { value: 'Buy milk' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText(/unclaimed/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /assign to me/i }))
    expect(screen.getByText(/claimed by ana/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /mark done/i }))
    expect(
      screen.getByRole('button', { name: /reopen/i }),
    ).toBeInTheDocument()
  })
})

describe('AppHome (signed in with a family)', () => {
  it('resolves the family and shows the dashboard; shortcuts switch views', () => {
    // Firebase is unconfigured in tests, so FamilyProvider yields a demo family.
    render(
      <AuthContext.Provider value={authValue()}>
        <FamilyProvider>
          <AppNavProvider>
            <AppHome />
          </AppNavProvider>
        </FamilyProvider>
      </AuthContext.Provider>,
    )

    // Lands on the Dashboard (the default module).
    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()

    // Module shortcut (n) switches to Notices.
    fireEvent.keyDown(document.body, { key: 'n' })
    expect(
      screen.getByRole('heading', { name: 'Notices' }),
    ).toBeInTheDocument()
  })
})
