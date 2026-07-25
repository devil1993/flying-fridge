/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Flying Fridge',
        short_name: 'Flying Fridge',
        description:
          "Your family's digital noticeboard — tasks, notices, pantry, lost & found and questions.",
        theme_color: '#4F6DF5',
        background_color: '#F7F9FC',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
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
