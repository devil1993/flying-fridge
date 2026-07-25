# Flying Fridge — Design Documents

This folder holds the **design documents** for Flying Fridge: a digital
noticeboard for families (a modern, online take on the classic
fridge-and-magnets way of sharing household information). It is a
**frontend-only React app backed by Firebase**, built as a **mobile-first PWA
with push notifications**.

These documents describe *how* the app is intended to be structured and why.
They are **forward-looking**: they guide upcoming requirements and set the
conventions that future code should follow. Where a decision has been formally
recorded, the design docs **reference** an ADR rather than restating it.

## How this relates to the rest of the repo

- **`requirements/`** — the product/functional source of truth
  (`overview.md`, then `requirement-N.md` per batch). Design docs turn those
  requirements into a technical shape.
- **`docs/adr/`** — Architecture/Design Decision Records. The *stack choices*
  (React + TypeScript, Vite, pnpm, react-router, react-i18next,
  `vite-plugin-pwa`/Workbox, Firebase Cloud Messaging, Vitest + React Testing
  Library, Firebase Auth + Firestore + FCM) are captured there. This design
  folder describes the *design that results from* those decisions and links to
  the ADRs instead of duplicating them.
- **`docs/design/`** (this folder) — the design docs below.
- **`human-instructions/`** — manual, out-of-workspace steps the maintainer
  performs (e.g. creating the Firebase project). Firebase is **not** set up yet;
  it is a manual human step.
- **`PROGRESS.md`** — running log of what is built and what is next.

## The documents

| Document | What it covers |
| --- | --- |
| [`architecture.md`](./architecture.md) | High-level architecture: the client SPA, Firebase services (Auth, Firestore, FCM), data flow, the service worker / PWA layer, module boundaries, and how auth-gated data access works. Includes a diagram. |
| [`folder-structure.md`](./folder-structure.md) | The intended repository and `src/` folder layout, one line per folder, plus naming and file conventions. |
| [`data-model.md`](./data-model.md) | A **provisional** Firestore data model: `users`, `families` (membership), and the five family-scoped item collections, with suggested fields and how security rules gate access by family membership. |
| [`pwa-and-notifications.md`](./pwa-and-notifications.md) | PWA design: manifest, install, offline/caching via Workbox, and the push-notification flow via Firebase Cloud Messaging (service worker, VAPID key, permission, foreground vs background messages). |
| [`i18n-and-accessibility.md`](./i18n-and-accessibility.md) | Internationalization (react-i18next, `en` default, key structure, adding locales) and the accessibility baseline (WCAG 2.1 AA, keyboard-first, focus management, landmarks, reduced-motion, contrast, a11y testing). |

## Reading order

1. **`architecture.md`** — the big picture; everything else fits inside it.
2. **`folder-structure.md`** — where code lives, so the modules from the
   architecture map to real directories.
3. **`data-model.md`** — the shapes that flow between client and Firestore.
4. **`pwa-and-notifications.md`** and **`i18n-and-accessibility.md`** — the two
   cross-cutting concerns that touch every feature.

## Status

Provisional and evolving. Anything marked **provisional** (notably the data
model) is expected to change as concrete feature requirements land. When a
design choice hardens into a commitment, record it as an ADR in `docs/adr/` and
link it here.

## Environment / configuration contract

The Firebase web config is read from Vite env vars. Every document that touches
Firebase references this **exact** contract:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_FIREBASE_VAPID_KEY
```

These are supplied via a local `.env` file (never committed); setup lives in
`human-instructions/`.
