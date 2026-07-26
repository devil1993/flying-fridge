import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext, type AuthContextValue, type AuthStatus } from './features/auth/authContext'
import { Home } from './App'

const noop = async () => {}

function authValue(status: AuthStatus): AuthContextValue {
  return {
    user: status === 'authenticated' ? { id: 'u1', name: 'Ana', email: null } : null,
    status,
    signInEmail: noop,
    registerEmail: noop,
    signInGoogle: noop,
    signOut: noop,
  }
}

function renderHome(status: AuthStatus) {
  return render(
    <AuthContext.Provider value={authValue(status)}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<h1>App home</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('Home (root route)', () => {
  it('sends signed-in users straight to /app (skipping the welcome screen)', () => {
    renderHome('authenticated')
    expect(screen.getByRole('heading', { name: 'App home' })).toBeInTheDocument()
  })

  it('renders nothing while auth is still resolving (no welcome flash)', () => {
    const { container } = renderHome('loading')
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('heading', { name: 'App home' })).not.toBeInTheDocument()
  })

  it('shows the landing page for signed-out visitors', () => {
    renderHome('unauthenticated')
    expect(screen.queryByRole('heading', { name: 'App home' })).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
