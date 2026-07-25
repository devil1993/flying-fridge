# Flying Fridge — Progress Plan

A running log of what's built and what's next, so new requirement files can be
added to `requirements/` and picked up incrementally. Update this file as each
requirement is completed.

## How this project grows

1. A new `requirements/requirement-N.md` describes the next batch of work
   (Functional / Technical / Polishing).
2. Work is implemented, committed to git with a proper message (repo-local
   credentials only — never pushed from here unless asked).
3. This file is updated: move the item to **Done**, note any decisions.

## Status legend
✅ Done · 🚧 In progress · ⬜ Not started

---

## Requirement 1 — Landing page ✅

Source: `requirements/requirement-1.md`

- ✅ Fun, modern landing page as a **single self-contained `index.html`**
  (all CSS/JS inline, zero external network requests, inline-SVG graphics).
- ✅ **Light & dark theme from the system** (`prefers-color-scheme`), plus a
  manual toggle that defaults to the system preference and persists overrides
  in `localStorage`.
- ✅ **Simple, fun animations** — floating fridge magnets, staggered sticky-note
  wiggle, scroll-reveal via `IntersectionObserver`; all gated behind
  `prefers-reduced-motion: reduce`.
- ✅ Standard landing sections: header/nav, hero + CTAs, five feature topics
  (Tasks, Notices, Lost & Found, Pantry, Questions), List & Calendar views,
  how-it-works, closing CTA band, footer.

**Notes / decisions**
- CTAs point to placeholder anchors (`#`) — this file is intended to **become
  the app's index page later**, so no backend routes were invented.
- Design language: warm parchment + tangerine/sage palette, per-category magnet
  colors reused consistently (hero, feature borders, list dots, calendar dots),
  serif display / system-sans body, fridge-with-wings logo motif.

**Deferred to a future requirement**
- Wiring CTAs to real auth / "join a family" flow.
- Turning the static views into the actual app shell.

---

## Backlog / candidate features (from requirement-1 "Polishing")

Not scheduled — raised for consideration when writing future requirement files:

- **Auth & family spaces** — sign up, log in, create/join a family via invite code.
- **The five boards themselves** — CRUD for Tasks, Notices, Lost & Found,
  Pantry, Questions, each pinned as a "magnet" on the board.
- **List & Calendar views** — real, filterable/sortable views over the items.
- **Reminders & notifications** — due-date nudges, "pantry low" alerts.
- **Assignments & @mentions** — assign a task to a family member.
- **Recurring items** — weekly chores, standing shopping-list staples.
- **Pantry smarts** — quantity tracking, low-stock auto-flag, quick "add to list".
- **PWA / offline** — installable, works offline, syncs when back online.
- **Real-time sync** — changes appear live across family members' devices.
- **Media on notes** — attach a photo (e.g. of the lost item, or a receipt).
- **Search & tags** across everything on the board.
- **Themes & personalization** — custom magnet colors, family avatar/name.
- **Localization** — multi-language support.

---

## Next up ⬜

Awaiting `requirements/requirement-2.md`.
