import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'

const renderLanding = () =>
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )

describe('LandingPage', () => {
  it('renders the main and footer landmarks and the brand name', () => {
    renderLanding()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByText(/Flying Fridge/i).length).toBeGreaterThan(0)
  })

  it('exposes the theme toggle for keyboard users', () => {
    renderLanding()
    expect(document.querySelector('#themeToggle')).not.toBeNull()
  })

  it('offers an accessible palette switcher including a high-contrast option', () => {
    renderLanding()
    const select = screen.getByLabelText('Colour theme')
    expect(select).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'High Contrast' }),
    ).toBeInTheDocument()
  })

  it('switches palette and persists the choice', () => {
    renderLanding()
    const select = screen.getByLabelText<HTMLSelectElement>('Colour theme')
    fireEvent.change(select, { target: { value: 'forest' } })
    expect(document.documentElement.getAttribute('data-palette')).toBe('forest')
    expect(localStorage.getItem('ff-palette')).toBe('forest')
  })
})
