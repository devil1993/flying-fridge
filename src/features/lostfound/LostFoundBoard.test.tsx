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
  familyId: 'fam',
  familyName: 'Fam',
  join: () => {},
  leave: () => {},
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
  it('posts a search and marks it found', () => {
    renderBoard(new InMemoryLostRepository())
    fireEvent.change(screen.getByLabelText(/what are you looking for/i), {
      target: { value: 'My keys' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Post' }))
    expect(screen.getByText('My keys')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /found it/i }))
    expect(screen.queryByText('My keys')).not.toBeInTheDocument()
  })
})
