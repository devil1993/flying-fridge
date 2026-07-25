import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { InMemoryPantryRepository } from './repository'
import PantryBoard from './PantryBoard'

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

function renderBoard(repo: InMemoryPantryRepository) {
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue()}>
        <PantryBoard repository={repo} />
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

describe('PantryBoard', () => {
  it('adds an item, adjusts quantity, and marks it consumed', () => {
    renderBoard(new InMemoryPantryRepository())
    fireEvent.change(screen.getByLabelText(/food item/i), {
      target: { value: 'Milk' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Milk')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }))
    expect(screen.getByText('2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Consumed' }))
    expect(screen.queryByText('Milk')).not.toBeInTheDocument()
  })
})
