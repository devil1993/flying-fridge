import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { FamilyProvider } from '../family/FamilyProvider'
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
  return { familyId: 'fam', familyName: 'Fam', join: () => {}, leave: () => {} }
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

describe('AppHome family gate', () => {
  it('shows family setup, then the dashboard once a family is joined', () => {
    localStorage.clear()
    render(
      <AuthContext.Provider value={authValue()}>
        <FamilyProvider>
          <AppHome />
        </FamilyProvider>
      </AuthContext.Provider>,
    )

    expect(
      screen.getByRole('heading', { name: /join your family/i }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/family name or code/i), {
      target: { value: 'The Okonkwos' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })
})
