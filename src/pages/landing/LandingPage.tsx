import { useEffect, useRef } from 'react'
import './landing.css'
import { toggleMode, setPalette, currentPalette, type Palette } from '../../lib/theme'
// The requirement-1 landing page is preserved verbatim as raw markup and its
// original CSS. Its inline <script> is re-implemented as the effect below.
// See docs/adr/0011-landing-page-static-markup.md.
import landingHtml from './landing.body.html?raw'

export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cleanups: Array<() => void> = []

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
