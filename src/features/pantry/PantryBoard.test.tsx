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
  status: 'ready',
  familyId: 'fam',
  familyName: 'Fam',
  members: [],
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
    // Off the stock list, now under Recently closed with a Restore action.
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Consumed' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore' }))
    expect(screen.getByRole('button', { name: 'Consumed' })).toBeInTheDocument()
  })

  it('edits an item in place to fix a mistake', () => {
    renderBoard(new InMemoryPantryRepository())
    fireEvent.change(screen.getByLabelText(/food item/i), {
      target: { value: 'Milc' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Edit food item'), {
      target: { value: 'Milk' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.queryByText('Milc')).not.toBeInTheDocument()
  })
})
