import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { InMemoryQuestionRepository } from './repository'
import QuestionsBoard from './QuestionsBoard'

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

function renderBoard(repo: InMemoryQuestionRepository) {
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue()}>
        <QuestionsBoard repository={repo} />
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

describe('QuestionsBoard', () => {
  it('asks a question, answers it, and closes it', () => {
    renderBoard(new InMemoryQuestionRepository())
    fireEvent.change(screen.getByLabelText('Question'), {
      target: { value: 'Pizza or pasta?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
    expect(screen.getByText('Pizza or pasta?')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Your answer'), {
      target: { value: 'Pizza' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Answer' }))
    expect(screen.getByText('Pizza')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    // Off the open list, now under Recently closed with a Restore action.
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('edits a question in place to fix a mistake', () => {
    renderBoard(new InMemoryQuestionRepository())
    fireEvent.change(screen.getByLabelText('Question'), {
      target: { value: 'Piza or pasta?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Edit question'), {
      target: { value: 'Pizza or pasta?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Pizza or pasta?')).toBeInTheDocument()
    expect(screen.queryByText('Piza or pasta?')).not.toBeInTheDocument()
  })
})
