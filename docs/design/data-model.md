# Data Model (PROVISIONAL)

> **PROVISIONAL.** This is a first-cut Firestore data model to guide upcoming
> requirements. Field names, shapes, and collection layout are expected to
> change as concrete feature requirements land. Nothing here is a commitment;
> when a shape hardens, record it as an ADR in `docs/adr/` and update this doc.
> **Firebase is not provisioned yet** — this describes the intended model, not a
> deployed schema.

Flying Fridge stores three kinds of data in **Cloud Firestore**:

1. **`users`** — one document per authenticated person.
2. **`families`** — a family group and its membership.
3. **Five family-scoped item collections** — `tasks`, `notices`,
   `lostAndFound`, `pantry`, `questions`.

Everything except `users` is **family-scoped**: a document belongs to exactly
one family, and access is gated by whether the requesting user is a member of
that family.

## 1. Collection layout

Two layouts are viable; this design uses **subcollections under each family** so
that "all items for my family" is a natural, rule-friendly query and
family-scoping is structural rather than a filter you must remember.

```
users/{userId}
families/{familyId}
families/{familyId}/members/{userId}
families/{familyId}/tasks/{taskId}
families/{familyId}/notices/{noticeId}
families/{familyId}/lostAndFound/{itemId}
families/{familyId}/pantry/{itemId}
families/{familyId}/questions/{questionId}
```

> Alternative considered (provisional): top-level item collections with a
> `familyId` field on every document (e.g. `tasks/{taskId}` with
> `familyId: "..."`). Simpler for cross-family admin queries but pushes all
> scoping into query filters + rules. The subcollection layout above is
> preferred for now because membership and scoping compose cleanly. This is an
> open decision.

## 2. Common fields (every item type)

All five item types share a base shape. Type-specific fields are added on top.

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Document id (also the Firestore doc key). |
| `familyId` | string | The owning family. Redundant under subcollections but kept for portability and rule clarity. |
| `type` | enum | One of `task \| notice \| lostAndFound \| pantry \| question`. |
| `authorId` | string | `uid` of the creator (a `users` doc id). |
| `title` | string | Short summary shown in list/calendar. |
| `body` | string? | Optional longer text/details. |
| `status` | enum | Lifecycle state; values depend on type (see below). |
| `createdAt` | timestamp | Server timestamp on creation. |
| `updatedAt` | timestamp | Server timestamp on last edit. |
| `dueDate` | timestamp? | For **calendar view** — when something is due (tasks). |
| `eventDate` | timestamp? | For **calendar view** — when something happens (notices/questions). |

**Calendar view** renders any item that carries a `dueDate` or `eventDate`;
**list view** renders all items grouped/filtered by `type` and `status`.

## 3. `users`

```
users/{userId}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Equals the Firebase Auth `uid`. |
| `displayName` | string | Shown on items and mentions. |
| `email` | string | From the auth provider. |
| `photoURL` | string? | Optional avatar. |
| `familyIds` | string[] | Families this user belongs to (supports being in more than one). |
| `locale` | string? | Preferred language (defaults to `en`). |
| `fcmTokens` | string[]? | Device push tokens for FCM (see the PWA doc). |
| `createdAt` | timestamp | |

A user can read/write **their own** `users/{userId}` document only.

## 4. `families` and membership

```
families/{familyId}
families/{familyId}/members/{userId}
```

**`families/{familyId}`**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Family id. |
| `name` | string | Family display name. |
| `inviteCode` | string | Code used to join (rotatable). |
| `createdBy` | string | `uid` of the creator. |
| `createdAt` | timestamp | |

**`families/{familyId}/members/{userId}`** — the authoritative membership
record. Its **existence** is what "user X is in family Y" means, which is
exactly what Security Rules check.

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | string | Member's `uid` (= doc id). |
| `role` | enum | `owner \| member` (provisional; roles may expand). |
| `displayName` | string | Denormalized for quick member lists. |
| `joinedAt` | timestamp | |

Joining a family: the user submits an `inviteCode`; a member doc is created
under that family and `familyIds` is updated on their user doc. (The exact
write path — client transaction vs. a future callable function — is an open
decision; keeping it additive is preferred.)

## 5. The five item types (type-specific fields)

All extend the **common fields** in §2.

### Tasks — `families/{familyId}/tasks/{taskId}`
Things the family needs to do (shopping, laundry, pay bills).

| Field | Type | Notes |
| --- | --- | --- |
| `status` | enum | `open \| done` (provisional; may add `inProgress`). |
| `assigneeId` | string? | `uid` the task is assigned to (future @mentions/assignment). |
| `dueDate` | timestamp? | Drives calendar placement. |

### Notices / Info — `families/{familyId}/notices/{noticeId}`
Information for everyone ("holiday on the 15th", "dinner out Friday").

| Field | Type | Notes |
| --- | --- | --- |
| `status` | enum | `active \| archived`. |
| `eventDate` | timestamp? | When the noticed thing happens (calendar). |

### Lost & Found — `families/{familyId}/lostAndFound/{itemId}`
Things someone is looking for; others can mark **found**.

| Field | Type | Notes |
| --- | --- | --- |
| `status` | enum | `lost \| found`. |
| `foundBy` | string? | `uid` who marked it found. |
| `foundAt` | timestamp? | When it was marked found. |

### Pantry — `families/{familyId}/pantry/{itemId}`
What's in the fridge; people mark items **consumed/deleted**.

| Field | Type | Notes |
| --- | --- | --- |
| `status` | enum | `available \| consumed`. |
| `quantity` | string? | Free-form for now ("rice for 1.5", "2 people"). |
| `expiresOn` | timestamp? | For "expires Monday" reminders (calendar + future alerts). |

### Questions — `families/{familyId}/questions/{questionId}`
Open questions to the family ("movies Sunday, anyone in?").

| Field | Type | Notes |
| --- | --- | --- |
| `status` | enum | `open \| closed`. |
| `eventDate` | timestamp? | If the question references a date (calendar). |
| `responses` | (subcollection, future) | Replies may become `.../questions/{id}/responses/{id}`. Least-defined type; expect change. |

## 6. Family-scoping & Security Rules (high level)

The client route guard is UX only. The **real** access boundary is **Firestore
Security Rules**, which run on Firebase and cannot be bypassed by the client.
(See [`architecture.md`](./architecture.md) §6.)

Principles:

1. **A request must be authenticated** — `request.auth != null` for anything
   family-scoped.
2. **Membership gates family data** — a user may read/write documents under
   `families/{familyId}/**` only if a `members/{uid}` document exists for that
   family. Membership existence *is* the check.
3. **Users own their own profile** — `users/{userId}` is readable/writable only
   by that `userId`.
4. **Author/immutability constraints** — `authorId`, `familyId`, and
   `createdAt` are set on create and not changed on update; certain status
   transitions (e.g. anyone in the family may mark a Lost & Found item `found`)
   are allowed, others restricted to the author/owner. Exact rules are
   provisional.

Illustrative shape (not final):

```
// families/{familyId}/{itemCollection}/{itemId}
function isFamilyMember(familyId) {
  return request.auth != null
      && exists(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid));
}

allow read:  if isFamilyMember(familyId);
allow create: if isFamilyMember(familyId)
              && request.resource.data.authorId == request.auth.uid;
allow update, delete: if isFamilyMember(familyId);
```

Because scoping is structural (data lives *under* the family) and re-verified by
rules on every operation, cross-family access is rejected even if the client
constructs the query itself. Composite indexes will be added as concrete
list/calendar queries (by `status`, `dueDate`/`eventDate`) are finalized.

## 6a. Implemented so far — Tasks (requirement-4, vertical slice)

The first concrete collection, behind a `TaskRepository` interface
(`src/features/tasks/repository.ts`) with a Firestore implementation and an
in-memory one for tests. Top-level `tasks` collection filtered by `familyId`
(the current chosen shape; see the subcollection open question below).

```
tasks/{taskId}
  familyId:     string        // scope
  description:  string
  targetDate:   string|null   // ISO yyyy-mm-dd; drives dashboard colour coding
  assigneeId:   string|null   // self-assign; null = unclaimed
  assigneeName: string|null
  status:       'open'|'done' // kept (timelined) even when done
  createdBy:    string        // uid
  createdAt:    timestamp
  updatedAt:    timestamp
```

Urgency buckets for colour coding (pure logic in `taskLogic.ts`): `overdue`,
`today`, `soon` (≤3 days), `later`, `none` (done or no date). Still to wire:
auth/family context and the Tasks UI (dashboard + self-assign section).

## 7. Open questions (tracked, not resolved)

- Subcollections vs. top-level collections with a `familyId` filter.
- Whether joins/mentions/pantry-alerts need Cloud Functions (would add a small
  server surface) or can stay client-only.
- Response/threading model for Questions.
- Multi-family UX and how "current family" is selected and persisted.
- Soft-delete vs. hard-delete and any history/audit needs.
