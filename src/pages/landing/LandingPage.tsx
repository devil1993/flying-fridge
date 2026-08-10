import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './landing.css'
import { toggleMode, setPalette, currentPalette, type Palette } from '../../lib/theme'
// The requirement-1 landing page is preserved verbatim as raw markup and its
// original CSS. Its inline <script> is re-implemented as the effect below.
// See docs/adr/0011-landing-page-static-markup.md.
import landingHtml from './landing.body.html?raw'

// The raw markup uses root-absolute in-app links (`/app`, `/guide`). Prefix them
// with Vite's BASE_URL so they resolve under a sub-path deploy (GitHub Pages
// '/flying-fridge/'). At the default base ('/') this is a no-op, so the
// requirement-1 markup still renders verbatim locally (ADR-0011).
const base = import.meta.env.BASE_URL
const landingHtmlBased = landingHtml
  .replace(/href="\/app"/g, `href="${base}app"`)
  .replace(/href="\/guide"/g, `href="${base}guide"`)

export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cleanups: Array<() => void> = []
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // --- Router-aware links. The markup uses raw <a> tags: in-page anchors
    //     (#features) and app links (/app, /guide). Left alone they change the
    //     URL/hash or trigger a full reload, which churns the SPA and can blank
    //     the page. Intercept them: smooth-scroll for anchors, client-side
    //     navigate for app links. External/unknown links fall through. ---
    const stripBase = (p: string) =>
      base !== '/' && p.startsWith(base) ? '/' + p.slice(base.length) : p
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      const anchor = (e.target as HTMLElement).closest('a')
      const href = anchor?.getAttribute('href')
      if (!href) return
      if (href.startsWith('#')) {
        e.preventDefault()
        const target = href.length > 1 ? root.querySelector(href) : null
        if (target) {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
        }
        return
      }
      const path = stripBase(href)
      if (path === '/app' || path === '/guide') {
        e.preventDefault()
        navigate(path)
      }
    }
    root.addEventListener('click', onClick)
    cleanups.push(() => root.removeEventListener('click', onClick))

    // Make the landing's <main> a skip-link target.
    const main = root.querySelector('main')
    if (main && !main.id) main.id = 'main-content'

    // --- Theme controls: wire the landing's mode toggle + palette switcher to
    //     the app-wide theme module (src/lib/theme.ts). Initial mode/palette
    //     are applied once at startup in main.tsx, so this only handles input. ---
    const btn = root.querySelector<HTMLButtonElement>('#themeToggle')
    if (btn) {
      const onClick = () => toggleMode()
      btn.addEventListener('click', onClick)
      cleanups.push(() => btn.removeEventListener('click', onClick))
    }
    const paletteSelect = root.querySelector<HTMLSelectElement>('#paletteSelect')
    if (paletteSelect) {
      paletteSelect.value = currentPalette()
      const onPalette = () => setPalette(paletteSelect.value as Palette)
      paletteSelect.addEventListener('change', onPalette)
      cleanups.push(() => paletteSelect.removeEventListener('change', onPalette))
    }

    // --- Reveal content. Reveal everything up-front (the CSS keeps a staggered
    //     transition, so it's a gentle entrance) rather than depending on a
    //     scroll observer — that way content is never left stuck at opacity 0. ---
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) =>
      el.classList.add('visible'),
    )

    // --- Floating chips: delayed entrance. ---
    const timers: number[] = []
    root.querySelectorAll<HTMLElement>('.floating-chip').forEach((chip, i) => {
      const id = window.setTimeout(
        () => chip.classList.add('visible'),
        reducedMotion ? 0 : 600 + i * 300,
      )
      timers.push(id)
    })
    cleanups.push(() => timers.forEach((id) => window.clearTimeout(id)))

    // --- Nav: active-link highlight on scroll. ---
    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[id]'))
    const navLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]'),
    )
    if (sections.length && navLinks.length) {
      const navIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            navLinks.forEach((link) => {
              link.style.color =
                link.getAttribute('href') === `#${entry.target.id}`
                  ? 'var(--col-primary)'
                  : ''
            })
          })
        },
        { rootMargin: '-30% 0px -60% 0px' },
      )
      sections.forEach((sec) => navIo.observe(sec))
      cleanups.push(() => navIo.disconnect())
    }

    // --- Header: shadow on scroll. ---
    const header = root.querySelector<HTMLElement>('.site-header')
    if (header) {
      const onScroll = () => {
        header.style.boxShadow = window.scrollY > 8 ? 'var(--shadow-md)' : 'none'
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [navigate])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: landingHtmlBased }} />
}
