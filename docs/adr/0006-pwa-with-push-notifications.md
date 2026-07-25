# 0006 — PWA with Push Notifications

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Architecture

## Context

Flying Fridge is explicitly mobile-first (`requirements/requirement-2.md`: "the design should be mobile first as that is the primary medium"). Family members need to be notified of new tasks, pantry expiry warnings, or "found it" updates without being inside the app. The app also needs to function in low-connectivity situations (a family member checking what's in the pantry when the signal is poor). These two needs — installability/offline and push — point toward Progressive Web App patterns rather than a native mobile app.

Building a native iOS + Android app is out of scope for the current phase.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **PWA (vite-plugin-pwa / Workbox + FCM)** | No app store; installable from the browser; service worker caches assets for offline; FCM handles push on web, Android, and iOS 16.4+ via the same backend; integrates directly with the Firebase backend chosen in ADR-0002 | Push on iOS requires iOS 16.4+ and the user must add the app to the home screen; Workbox configuration has a learning curve; service worker debugging is harder than regular JS debugging |
| Native iOS + Android apps | Best push reliability and OS integration; full offline capability | Requires React Native or separate native projects; app store review cycles; out of scope and out of budget for phase 1 |
| React Native (Expo) web + mobile | Share code across platforms; native push via Expo Notifications | Expo adds significant complexity; web support in Expo is secondary; contradicts the "web-first family noticeboard" framing |
| No push at all (polling) | Simple implementation | Users miss time-sensitive updates (expiring pantry items, task due dates); defeats the purpose of a live shared board |
| Browser Notifications API without a service worker | Simpler than full PWA | Notifications only work while the browser tab is open; no offline support; not installable |

## Decision

Implement the app as a **Progressive Web App** using:

- **`vite-plugin-pwa`** (wrapping Workbox) for service-worker generation, asset precaching, and the installable web-app manifest. Configured in `vite.config.ts`.
- **Firebase Cloud Messaging (FCM)** for push notifications, sharing the Firebase backend from ADR-0002. The FCM service worker (`firebase-messaging-sw.js`) runs alongside the Workbox service worker.
- **Mobile-first** layout and interaction design throughout, with responsive breakpoints added for larger screens secondarily.

## Consequences

**Positive:**
- The app is installable on the home screen of Android and iOS (16.4+) devices, giving a near-native experience without app store distribution.
- Workbox precaches the app shell so core UI is available offline; Firestore's own offline persistence (enabled by default in the Firebase SDK) keeps the last-synced board data readable without a network.
- FCM push works across web, Android (via browser), and iOS 16.4+ home-screen PWA — a single notification backend covers all family members' devices.
- No app store review process or developer account fee for distribution.

**Negative / costs:**
- **iOS push limitation:** push notifications only reach iOS users who have added the app to their home screen AND are running iOS 16.4 or later. Users on older iOS or those who access the app via Safari without adding it to the home screen will not receive push. This is a known platform constraint, not a product decision that can be engineered around.
- Two service workers (Workbox + FCM messaging SW) must coexist. The FCM SW must be served from the root (`/firebase-messaging-sw.js`) and is not automatically managed by `vite-plugin-pwa`. Manual registration and coordination is required.
- Workbox precache manifests are generated at build time. Adding a new route or asset requires a rebuild to cache it — stale service workers serving old content is a classic PWA failure mode and must be tested in CI.
- Service worker debugging requires DevTools' "Application" panel and deliberate `skipWaiting` / update strategies; errors are harder to trace than regular application code.

**Deferred:**
- Background sync (retrying writes made while offline) — deferred to a later requirement; Firestore's built-in queue handles the common case.
- Web Push VAPID key management — deferred until the Firebase project is set up (see `human-instructions/`).
