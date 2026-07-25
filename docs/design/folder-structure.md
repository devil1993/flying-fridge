# Folder Structure & Conventions

The intended repository and `src/` layout for **Flying Fridge**, with a
one-line purpose per folder and the naming conventions code should follow. This
mirrors the module boundaries in [`architecture.md`](./architecture.md).

> This is the *target* layout. Not every folder exists yet; create them as the
> corresponding work lands, but keep new code inside this shape.

## 1. Repository layout (top level)

```
flying-fridge/
├─ src/                     # Application source (see §2)
├─ public/                  # Static assets served as-is (icons, manifest inputs, firebase-messaging-sw.js)
├─ docs/                    # Project documentation
│  ├─ adr/                  # Architecture/Design Decision Records (stack decisions)
│  └─ design/               # Design documents (this folder)
├─ human-instructions/      # Manual, out-of-workspace steps the maintainer performs (e.g. Firebase setup)
├─ requirements/            # Product/functional requirements: overview.md + requirement-N.md
├─ .github/
│  └─ workflows/            # GitHub Actions CI (install, lint, test, build)
├─ index.html              # Vite HTML entry (mounts the SPA)
├─ package.json            # Dependencies + scripts (pnpm)
├─ pnpm-lock.yaml          # Lockfile (pnpm)
├─ tsconfig.json           # TypeScript config
├─ vite.config.ts          # Vite + vite-plugin-pwa config
├─ .env                    # Local Firebase config (NOT committed)
├─ .env.example            # Documented, value-less template of required env vars
├─ .gitignore
├─ CLAUDE.md               # Guidance for Claude Code
└─ PROGRESS.md             # Running progress log
```

Notes:
- **`public/`** holds files copied verbatim into the build. The FCM background
  service worker (`firebase-messaging-sw.js`) lives here so it is served from
  the site root at a stable URL. App icons and the manifest inputs also live
  here.
- **`.env` is never committed.** `.env.example` documents the exact variable
  names (no values) so a new environment can be set up from
  `human-instructions/`.

## 2. `src/` layout

```
src/
├─ main.tsx                # App bootstrap: mount React, install providers (router, i18n), register the PWA/service worker
├─ App.tsx                 # Root component: route tree, auth guard, top-level layout/landmarks
├─ pages/                  # Route-level screens that compose features (thin; orchestration only)
├─ components/             # Shared, presentational, app-agnostic UI + accessibility primitives (no Firebase)
├─ features/              # One folder per domain area; each owns its UI, hooks, and data access
│  ├─ auth/               #   sign-in / sign-out, session/auth state
│  ├─ family/             #   create/join a family, membership, current-family context
│  ├─ tasks/             #   Tasks board
│  ├─ notices/           #   Info/Notices board
│  ├─ lostAndFound/      #   Lost & Found board (mark as found)
│  ├─ pantry/            #   Pantry board (mark consumed/deleted)
│  ├─ questions/         #   Questions board
│  └─ guide/             #   In-app user Guide: module registry + i18n content + guardrail tests (docs/design/guide.md)
├─ lib/
│  ├─ firebase/          # Firebase SDK init from env + typed Auth/Firestore/Messaging helpers (only place the SDK is imported)
│  └─ theme.ts           # App-wide theme control: light/dark + palette, applied to <html> (tokens in styles/theme.css)
├─ i18n/                  # react-i18next config + locale resource bundles (en default)
├─ styles/               # Global styles: theme.css (design tokens, palettes, light/dark), global.css (base reset)
└─ test/                 # Test setup + shared testing utilities (Vitest + React Testing Library)
```

### Inside a `features/<name>/` folder (convention)

Each feature is self-contained so features can be built in parallel without
collisions:

```
features/tasks/
├─ components/            # UI specific to this feature
├─ hooks/                # Data + state hooks (e.g. useTasks) that call lib/firebase
├─ types.ts              # Feature-local TypeScript types (shared item types may live in a common types module)
├─ index.ts              # Public surface of the feature (what pages may import)
└─ *.test.tsx            # Co-located tests
```

Only import a feature through its `index.ts` public surface — do not reach into
another feature's internals.

## 3. Dependency rules

- `pages` → `features` → `components`. Pages compose features; features use
  shared components.
- `features/*` → `lib/firebase` for all backend access. **No component or page
  imports the Firebase SDK directly** — only `lib/firebase` does.
- `components/` is Firebase-free and side-effect-free where possible, so it is
  trivially unit-testable and reusable.
- Cross-cutting (`i18n`, `styles`, `test`) may be used anywhere.

## 4. Naming & file conventions

| Thing | Convention | Example |
| --- | --- | --- |
| React component files | `PascalCase.tsx` | `TaskCard.tsx`, `App.tsx` |
| Hooks | `useX.ts` (camelCase, `use` prefix) | `useTasks.ts`, `useAuth.ts` |
| Non-component modules / helpers | `camelCase.ts` | `firebase.ts`, `formatDate.ts` |
| Feature folders | `camelCase` matching the domain | `lostAndFound/`, `pantry/` |
| Firestore collections | `camelCase`, matching feature names | `lostAndFound`, `questions` |
| Types/interfaces | `PascalCase` | `Task`, `FamilyMember` |
| Test files | co-located `*.test.ts(x)` | `TaskCard.test.tsx` |
| i18n keys | dot-namespaced by feature | `tasks.list.empty` |
| Env vars | `VITE_FIREBASE_*` (see below) | `VITE_FIREBASE_PROJECT_ID` |

Additional conventions:
- **TypeScript everywhere**; prefer explicit exported types at feature
  boundaries.
- **One React component per file**; the file name matches the component.
- **Absolute-ish imports**: import features via their `index.ts`; avoid deep
  relative paths across module boundaries.
- **No user-facing string literals in JSX** — route them through i18n keys (see
  [`i18n-and-accessibility.md`](./i18n-and-accessibility.md)).

## 5. Environment variables (config contract)

Firebase config is read from Vite env vars (exposed to the client because they
are prefixed `VITE_`). `.env.example` lists exactly these names with empty
values:

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

The real `.env` is git-ignored. Populating it is a manual human step documented
in `human-instructions/`, because **Firebase is not provisioned yet**.
