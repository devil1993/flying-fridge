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

## What these rules do (read this)

- **Any signed-in user can read/write `tasks`.** They are **not yet scoped to a
  family** — because "family" is currently just a shared code held in the
  browser (`localStorage`), not stored in Firestore, so the rules have nothing
  to check membership against. In practice: everyone signed in to your project
  can see every family's tasks right now.
- **Everything else is denied.**

This is fine for trying out the Tasks slice with your own account(s). Before this
is shared more widely, we'll store family membership in Firestore and tighten the
rules to `isFamilyMember(familyId)` (tracked in `docs/design/data-model.md` §5 and
`PROGRESS.md`). Update `firestore.rules` and re-publish when we do.

## Verify it worked

- Reload the app, go to `/app`, sign in, join a family, add a task — it should
  save and appear (and persist across reloads).
- If you still see permission errors, confirm you clicked **Publish** and that
  you're **signed in** in the app (the rules require `request.auth != null`).
