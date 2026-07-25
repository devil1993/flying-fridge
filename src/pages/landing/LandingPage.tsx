import { useEffect, useRef } from 'react'
import './landing.css'
// The requirement-1 landing page is preserved verbatim as raw markup and its
// original CSS. Its inline <script> is re-implemented as the effect below.
// See docs/adr/0011-landing-page-static-markup.md.
import landingHtml from './landing.body.html?raw'

export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const html = document.documentElement
    const cleanups: Array<() => void> = []

    // Make the landing's <main> a skip-link target.
    const main = root.querySelector('main')
    if (main && !main.id) main.id = 'main-content'

    // --- Theme: two axes (mode + palette), both persisted. ---
    const PALETTES = ['blueberry', 'grape', 'forest', 'ocean', 'contrast']
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)')

    const systemMode = () => (darkMq.matches ? 'dark' : 'light')
    const storedMode = () => {
      const v = localStorage.getItem('ff-theme')
      return v === 'dark' || v === 'light' ? v : null
    }

    // Keep the browser UI (address bar) colour in sync with the active theme.
    const syncThemeColor = () => {
      const primary = getComputedStyle(html).getPropertyValue('--col-primary').trim()
      if (!primary) return
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'theme-color'
        document.head.appendChild(meta)
      }
      meta.content = primary
    }

    // Initial mode (stored override, else system) and palette (stored, else
    // High Contrast when the OS asks for more contrast, else Blueberry).
    html.setAttribute('data-theme', storedMode() ?? systemMode())
    const storedPalette = localStorage.getItem('ff-palette')
    const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches
    html.setAttribute(
      'data-palette',
      storedPalette && PALETTES.includes(storedPalette)
        ? storedPalette
        : prefersMoreContrast
          ? 'contrast'
          : 'blueberry',
    )
    syncThemeColor()

    // Light/dark toggle.
    const btn = root.querySelector<HTMLButtonElement>('#themeToggle')
    if (btn) {
      const onClick = () => {
        const next =
          (html.getAttribute('data-theme') || systemMode()) === 'dark'
            ? 'light'
            : 'dark'
        html.setAttribute('data-theme', next)
        localStorage.setItem('ff-theme', next)
        syncThemeColor()
      }
      btn.addEventListener('click', onClick)
      cleanups.push(() => btn.removeEventListener('click', onClick))
    }

    // Palette switcher.
    const paletteSelect = root.querySelector<HTMLSelectElement>('#paletteSelect')
    if (paletteSelect) {
      paletteSelect.value = html.getAttribute('data-palette') ?? 'blueberry'
      const onPalette = () => {
        html.setAttribute('data-palette', paletteSelect.value)
        localStorage.setItem('ff-palette', paletteSelect.value)
        syncThemeColor()
      }
      paletteSelect.addEventListener('change', onPalette)
      cleanups.push(() => paletteSelect.removeEventListener('change', onPalette))
    }

    // Follow the system mode while the user hasn't chosen one explicitly.
    const onScheme = () => {
      if (!storedMode()) {
        html.setAttribute('data-theme', systemMode())
        syncThemeColor()
      }
    }
    darkMq.addEventListener('change', onScheme)
    cleanups.push(() => darkMq.removeEventListener('change', onScheme))

    // --- Scroll reveal (respect reduced motion). ---
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    if (reducedMotion) {
      reveals.forEach((el) => el.classList.add('visible'))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 },
      )
      reveals.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

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
  }, [])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: landingHtml }} />
}
