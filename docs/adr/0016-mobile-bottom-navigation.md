# 0016 — Bottom Navigation on Small Screens

- **Status:** Accepted
- **Date:** 2026-07-26
- **Type:** UX / Frontend

## Context

Flying Fridge is a mobile-first, installable PWA whose core loop is hopping
between boards (Dashboard, Tasks, Notices, Lost & Found, Pantry, Questions). On
small screens the module tabs lived inside the top **hamburger** menu, which
hides every primary destination behind a tap — poor discoverability and an extra
tap per switch, exactly the friction that suppresses engagement across a family
noticeboard's boards.

## Options Considered

| Option | Assessment |
|--------|------------|
| Hamburger / slide-in drawer (status quo) | Hides primary destinations; top-left is the hardest thumb reach. Fine for *secondary* items, not primary nav. |
| Persistent sidenav | A desktop pattern — on a phone it steals scarce horizontal width and cramps board content. Rejected. |
| **Bottom tab bar (chosen)** | Thumb-reachable, always visible, the native app convention users expect from an installed PWA. Primary destinations stay in sight. |

## Decision

On screens `<720px`, show a fixed **bottom navigation bar** with **icon-only**
tabs for the six content boards (Dashboard + the five boards), driving the same
`useAppNav` state as the desktop tabs. **Settings** and **Guide** — genuinely
secondary (config/help) — stay in the top hamburger as overflow, so the bar keeps
a tight set and no board is demoted. At `≥720px` the bottom bar is hidden and the
top bar's inline tabs take over (unchanged).

Icons reuse the Guide's existing module icon set (`features/guide/moduleIcons`)
for app-wide consistency; each tab keeps an `aria-label` (icon-only is visual,
not semantic) and `aria-current="page"` for the active module. The app content
reserves bottom padding below 720px (and respects `env(safe-area-inset-bottom)`
for the iOS home indicator) so the bar never covers content.

## Consequences

**Positive:** every board is one thumb-tap away and always visible; matches
installed-PWA expectations; reuses existing nav state and icons, so it's additive
and low-risk; accessible (labels, focus, active state).

**Negative / costs:** six items sits just above the common "≤5 destinations"
guideline — accepted because all six are primary content and the icons are
compact; Settings/Guide now differ between mobile (hamburger) and desktop
(inline tab), a minor inconsistency. If the board count grows, this should move
to 5 primary + a "More" sheet.

**Cross-references:** ADR-0008 (accessibility baseline); `features/app/BottomNav`,
`features/app/appNav` (`APP_MODULES`), `features/guide/moduleIcons`.
