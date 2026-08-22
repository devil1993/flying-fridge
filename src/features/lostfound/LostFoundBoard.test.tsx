import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { InMemoryLostRepository } from './repository'
import LostFoundBoard from './LostFoundBoard'

const noop = async () => {}
const authValue = (): AuthContextValue => ({
  user: { id: 'u1', name: 'Ana', email: null },
  status: 'authenticated',
  signInEmail: noop,
  registerEmail: noop,
  signInGoogle: noop,
  signOut: noop,
})
const familyValue = (): FamilyContextValue => ({
  status: 'ready',
  familyId: 'fam',
  familyName: 'Fam',
  members: [],
})

function renderBoard(repo: InMemoryLostRepository) {
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue()}>
        <LostFoundBoard repository={repo} />
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

describe('LostFoundBoard', () => {
  it('posts a search, marks it found, and can restore it', () => {
    renderBoard(new InMemoryLostRepository())
    fireEvent.change(screen.getByLabelText(/what are you looking for/i), {
      target: { value: 'My keys' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Post' }))
    expect(screen.getByText('My keys')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /found it/i }))
    // Off the active board, now under Recently closed with a Restore action.
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /found it/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore' }))
    expect(screen.getByRole('button', { name: /found it/i })).toBeInTheDocument()
  })

  it('edits a post in place to fix a mistake', () => {
    renderBoard(new InMemoryLostRepository())
    fireEvent.change(screen.getByLabelText(/what are you looking for/i), {
      target: { value: 'My kees' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Post' }))

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Edit description'), {
      target: { value: 'My keys' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('My keys')).toBeInTheDocument()
    expect(screen.queryByText('My kees')).not.toBeInTheDocument()
  })
})
