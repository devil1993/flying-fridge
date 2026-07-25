import { render, screen, fireEvent } from '@testing-library/react'
import i18n from '../i18n/config'
import { AuthContext, type AuthContextValue } from '../features/auth/authContext'
import { FamilyContext, type FamilyContextValue } from '../features/family/familyContext'
import SettingsView from './SettingsView'

const noop = async () => {}
const authValue = (): AuthContextValue => ({
  user: { id: 'u1', name: 'Ana', email: 'ana@example.com' },
  status: 'authenticated',
  signInEmail: noop,
  registerEmail: noop,
  signInGoogle: noop,
  signOut: noop,
})
const familyValue = (): FamilyContextValue => ({
  status: 'ready',
  familyId: 'fam',
  familyName: 'Ghataks',
  members: [{ uid: 'u1', name: 'Ana', email: 'ana@example.com' }],
})

function renderSettings() {
  return render(
    <AuthContext.Provider value={authValue()}>
      <FamilyContext.Provider value={familyValue()}>
        <SettingsView />
      </FamilyContext.Provider>
    </AuthContext.Provider>,
  )
}

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('SettingsView', () => {
  it('shows family, account, and a language switcher', () => {
    renderSettings()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Settings' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ghataks')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'বাংলা' })).toBeInTheDocument()
  })

  it('switches the UI language to Bengali', async () => {
    renderSettings()
    fireEvent.change(screen.getByLabelText('Language'), {
      target: { value: 'bn' },
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'সেটিংস' }),
    ).toBeInTheDocument()
  })
})
