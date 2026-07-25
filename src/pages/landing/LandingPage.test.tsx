import { render, screen } from '@testing-library/react'
import LandingPage from './LandingPage'

describe('LandingPage', () => {
  it('renders the main and footer landmarks and the brand name', () => {
    render(<LandingPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByText(/Flying Fridge/i).length).toBeGreaterThan(0)
  })

  it('exposes the theme toggle for keyboard users', () => {
    render(<LandingPage />)
    expect(document.querySelector('#themeToggle')).not.toBeNull()
  })
})
