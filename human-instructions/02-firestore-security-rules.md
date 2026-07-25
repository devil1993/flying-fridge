# 02 — Publish Firestore Security Rules

**Why:** your Firestore database was created in **production mode**, which denies
all reads and writes by default. That's the `Missing or insufficient
permissions` error. You need to publish rules once so the signed-in app can use
the `tasks` collection.

The rules are version-controlled in the repo at **`firestore.rules`** — that
file is the source of truth. Publish it one of two ways.

---

## Option A — Firebase console (no tooling required) ✅ recommended

1. Open the [Firebase console](https://console.firebase.google.com/) → your
   **group-noticeboard** project.
2. Left sidebar → **Build → Firestore Database**.
3. Open the **Rules** tab (top).
4. Select all the existing text and replace it with the **entire contents of
   `firestore.rules`** from the repo (copy–paste).
5. Click **Publish**.
6. Back in the app, reload — adding/among tasks should now work.

## Option B — Firebase CLI (if you have it / want repeatable deploys)

```bash
npm i -g firebase-tools      # once
firebase login               # once
firebase deploy --only firestore:rules --project group-noticeboard
```

`firebase.json` in the repo already points at `firestore.rules`.

---

> **Re-publish when the rules change.** `firestore.rules` now (a) scopes all five
> board collections to **family membership**, (b) adds the **`notifications`**
> collection, and (c) **denies hard `delete`** everywhere (the app soft-deletes —
> ADR-0013). Whenever this file changes, repeat Option A or B to re-publish.

## What these rules do (read this)

- **Family membership is the access boundary.** A `families/{familyId}` doc lists
  `memberUids`; a user may read/write a board item only if their uid is in that
  family's `memberUids`. Members can read their own family doc; membership is
  **bootstrapped in the console** for now (see `03-bootstrap-family.md`).
- **`notifications`** is an append-only feed: members can read it and create their
  own entries (`actorId` must be the caller); no update/delete.
- **Hard delete is denied** on every board collection. The app removes things by
  setting a `deleted` marker (or a terminal status), so data is never destroyed.
- **Everything else is denied** (default deny).

Tracked in `docs/design/data-model.md` §6d–6f and ADR-0013. Update
`firestore.rules` and re-publish whenever rules change.

## Verify it worked

- Reload the app, go to `/app`, sign in, join a family, add a task — it should
  save and appear (and persist across reloads).
- If you still see permission errors, confirm you clicked **Publish** and that
  you're **signed in** in the app (the rules require `request.auth != null`).
