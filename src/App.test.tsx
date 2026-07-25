import { render, screen, within, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App routing', () => {
  it('renders the landing page and a skip link at the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders a not-found page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/nope']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('gates /app behind sign-in when signed out', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: /sign in to flying fridge/i }),
    ).toBeInTheDocument()
  })

  it('shows the top navigation with a Guide link on non-landing routes', () => {
    render(
      <MemoryRouter initialEntries={['/guide']}>
        <App />
      </MemoryRouter>,
    )
    const banner = screen.getByRole('banner')
    expect(
      within(banner).getByRole('link', { name: /guide/i }),
    ).toBeInTheDocument()
  })

  it('toggles the mobile hamburger menu', () => {
    render(
      <MemoryRouter initialEntries={['/guide']}>
        <App />
      </MemoryRouter>,
    )
    const burger = screen.getByRole('button', { name: /menu/i })
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
  })

  it('navigates via the single-key shortcut (g → guide)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    fireEvent.keyDown(document.body, { key: 'g' })
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /how flying fridge works/i,
      }),
    ).toBeInTheDocument()
  })
})
