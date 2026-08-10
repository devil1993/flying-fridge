import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from './AuthProvider'
import { AuthContext, type AuthContextValue } from './authContext'
import SignInPage from './SignInPage'

const noop = async () => {}

// Firebase is unconfigured in tests, so AuthProvider resolves to "signed out"
// and the sign-in actions are safe no-ops we don't invoke here.
function renderSignIn() {
  return render(
    <AuthProvider>
      <SignInPage />
    </AuthProvider>,
  )
}

describe('SignInPage', () => {
  it('renders email/password fields and both sign-in options', () => {
    renderSignIn()
    expect(
      screen.getByRole('heading', { name: /sign in to flying fridge/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /continue with google/i }),
    ).toBeInTheDocument()
  })

  it('validates that email and password are provided', () => {
    renderSignIn()
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      /enter your email and password/i,
    )
  })

  it('toggles between sign-in and register modes', () => {
    renderSignIn()
    fireEvent.click(
      screen.getByRole('button', { name: /new here\? create an account/i }),
    )
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument()
  })

  it('offers the demo and starts it on click', () => {
    const startDemo = vi.fn()
    const value: AuthContextValue = {
      user: null,
      status: 'unauthenticated',
      signInEmail: noop,
      registerEmail: noop,
      signInGoogle: noop,
      signOut: noop,
      startDemo,
    }
    render(
      <AuthContext.Provider value={value}>
        <SignInPage />
      </AuthContext.Provider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Try the demo' }))
    expect(startDemo).toHaveBeenCalledTimes(1)
  })
})
