import { render, screen, fireEvent } from '@testing-library/react'
import { AuthContext, type AuthContextValue } from '../auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../family/familyContext'
import { InMemoryNoticeRepository } from './repository'
import NoticesBoard from './NoticesBoard'

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

function renderBoard(repo: InMemoryNoticeRepository) {
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue()}>
        <NoticesBoard repository={repo} />
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

describe('NoticesBoard', () => {
  it('posts a notice and takes it down again', () => {
    renderBoard(new InMemoryNoticeRepository())
    fireEvent.change(screen.getByLabelText('Notice'), {
      target: { value: 'Wi-Fi is FRIDGE123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /post notice/i }))
    expect(screen.getByText('Wi-Fi is FRIDGE123')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /take down/i }))
    // Off the board, now under Recently closed with a Restore action.
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /take down/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore' }))
    expect(
      screen.getByRole('button', { name: /take down/i }),
    ).toBeInTheDocument()
  })

  it('edits a notice in place to fix a mistake', () => {
    renderBoard(new InMemoryNoticeRepository())
    fireEvent.change(screen.getByLabelText('Notice'), {
      target: { value: 'Wi-Fi is FRIDG123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /post notice/i }))

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Edit notice'), {
      target: { value: 'Wi-Fi is FRIDGE123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Wi-Fi is FRIDGE123')).toBeInTheDocument()
    expect(screen.queryByText('Wi-Fi is FRIDG123')).not.toBeInTheDocument()
  })

  it('makes a notice permanent', () => {
    renderBoard(new InMemoryNoticeRepository())
    fireEvent.change(screen.getByLabelText('Notice'), {
      target: { value: 'House rules' },
    })
    fireEvent.click(screen.getByRole('button', { name: /post notice/i }))
    fireEvent.click(screen.getByRole('button', { name: /make permanent/i }))
    expect(
      screen.getByRole('button', { name: /make temporary/i }),
    ).toBeInTheDocument()
  })
})
