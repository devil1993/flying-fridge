# 03 — Bootstrap a family (console)

A **family** is now a real backend entity: a `families/{familyId}` document with
a list of member user IDs. A signed-in user only sees the board once they're a
member of a family. Until the invite/join flow exists, you create families by
hand in the Firebase console.

## Prerequisites

1. Each future member **signs in to the app at least once** (this creates their
   Firebase Auth user). Signed-out or brand-new users have no UID yet.
2. The updated **Security Rules are published** (`firestore.rules`, via
   `human-instructions/02`). The rules now grant access by family membership.

## Find each member's UID

Firebase console → **Build → Authentication → Users**. The **User UID** column
holds each person's id (a long string). Copy the UIDs of everyone who should be
in the family. (In the app, a not-yet-added user also sees their own UID on the
"You're not in a family yet" screen — they can send it to you.)

## Create the family document

Firebase console → **Build → Firestore Database → Data**:

1. If there's no `families` collection yet: **Start collection** → id `families`.
2. **Add document** (let Firestore auto-generate the document ID, or type your
   own — that ID is the `familyId`).
3. Add these fields:

   | Field | Type | Value |
   | --- | --- | --- |
   | `name` | string | e.g. `The Okonkwos` |
   | `memberUids` | array | one string element per member UID |
   | `members` | map | *(optional, for display)* one entry per UID → map `{ name: "Ana", email: "ana@…" }` |

4. **Save.**

Example shape:

```
families/AbC123 = {
  name: "The Okonkwos",
  memberUids: ["uidAAA", "uidBBB"],
  members: {
    uidAAA: { name: "Ana",  email: "ana@example.com" },
    uidBBB: { name: "Ben",  email: "ben@example.com" }
  }
}
```

## Verify

Reload the app and sign in as one of those members → you should land on the
board (Dashboard) with the family name in the top bar. A user whose UID is **not**
in any `memberUids` sees "You're not in a family yet".

## Adding more members later

Edit the family document: append the new person's UID to `memberUids` (and add
them to `members`). They'll get access on their next load. (A proper
invite/approve flow and an admin screen are planned for a later requirement.)
