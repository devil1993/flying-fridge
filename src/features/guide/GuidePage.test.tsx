import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { GUIDE_MODULES } from './modules'
import en from '../../i18n/locales/en/translation.json'

const content = en.guide.modules as Record<string, { title: string }>

function renderGuideRoute() {
  return render(
    <MemoryRouter initialEntries={['/guide']}>
      <App />
    </MemoryRouter>,
  )
}

describe('GuidePage', () => {
  it('is reachable at /guide with a main landmark and page heading', () => {
    renderGuideRoute()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /how flying fridge works/i }),
    ).toBeInTheDocument()
  })

  it('renders a section heading for every documented module', () => {
    renderGuideRoute()
    for (const module of GUIDE_MODULES) {
      expect(
        screen.getByRole('heading', { level: 2, name: content[module.id].title }),
      ).toBeInTheDocument()
    }
  })

  it('provides an in-page table of contents linking to each module', () => {
    renderGuideRoute()
    const toc = screen.getByRole('navigation', { name: /on this page/i })
    for (const module of GUIDE_MODULES) {
      const link = within(toc).getByRole('link', {
        name: content[module.id].title,
      })
      expect(link).toHaveAttribute('href', `#${module.slug}`)
    }
  })
})
