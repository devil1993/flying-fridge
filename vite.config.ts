/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
//
// `base` defaults to '/' for local dev/preview. For a GitHub Pages *project*
// site the app is served from '/<repo>/', so the deploy workflow sets
// `VITE_BASE=/<repo>/` (derived from the repo name — no hard-coding here). The
// router reads it back via `import.meta.env.BASE_URL`, and the PWA manifest
// uses base-relative start_url/scope so it works at either path.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png',
        'pwa-192.png',
        'pwa-512.png',
        'maskable-512.png',
      ],
      manifest: {
        name: 'Flying Fridge',
        short_name: 'Flying Fridge',
        description:
          "Your family's digital noticeboard — tasks, notices, pantry, lost & found and questions.",
        theme_color: '#4F6DF5',
        background_color: '#F7F9FC',
        // Installs and launches as a standalone app — no browser URL bar or
        // back button. (iOS also needs the apple-* meta tags in index.html.)
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        categories: ['productivity', 'lifestyle'],
        lang: 'en',
        icons: [
          // Crisp vector for browsers that support SVG icons.
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          // Raster set for installability (Android/desktop) + iOS.
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // Full-bleed, safe-zoned icon for Android adaptive (masked) launchers.
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // The dev service worker is off to keep the dev loop simple; it is
      // generated for production builds.
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'jsdom',
    // A real origin so jsdom provides a working localStorage (opaque origins do not).
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    // Blank the Firebase config in tests so isFirebaseConfigured is false and the
    // app never contacts a live backend; features are tested via fakes/in-memory.
    env: {
      VITE_FIREBASE_API_KEY: '',
      VITE_FIREBASE_PROJECT_ID: '',
    },
    // The default 'forks' pool fails to spawn workers on this Windows/Node setup;
    // worker_threads start reliably.
    pool: 'threads',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
    exclude: ['node_modules', 'dist', 'dev-dist', 'e2e'],
  },
})
