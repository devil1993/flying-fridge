import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Initialise i18n so components resolve real strings in tests.
import '../i18n/config'

afterEach(() => {
  cleanup()
})

// jsdom with an opaque origin does not provide a usable localStorage; supply a
// simple in-memory implementation when it is missing or broken.
if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
  const store = new Map<string, string>()
  const memoryStorage: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  }
  Object.defineProperty(window, 'localStorage', {
    value: memoryStorage,
    configurable: true,
  })
}

// jsdom does not implement matchMedia; the landing page effect relies on it.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom does not implement IntersectionObserver.
if (typeof window.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    root = null
    rootMargin = ''
    thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver
}
