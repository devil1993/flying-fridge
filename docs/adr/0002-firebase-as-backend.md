# 0002 — Firebase as the Backend Platform

- **Status:** Accepted
- **Date:** 2026-07-25
- **Type:** Architecture

## Context

ADR-0001 establishes that Flying Fridge has no custom backend server. Something must fill that gap: authentication, a real-time database, and push notifications are all required by `requirements/requirement-2.md`. The chosen platform must work well from a purely client-side React app and support the mobile-first, family-sharing use case described in `requirements/overview.md`.

The Firebase project and its configuration values have **not yet been created**. That is a manual step performed by the developer outside the codebase; the instructions are in `human-instructions/` (Firebase project setup guide). The app's Firebase config object (API key, project ID, etc.) will be wired in once the human step is done.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Firebase (Auth + Firestore + FCM)** | Single-vendor, battle-tested; real-time listeners built in; generous free tier; FCM is first-class push for both web and mobile; well-supported React SDK (`firebase` v10 modular) | Hard vendor lock-in; Firestore document/collection model can be awkward for relational queries; security relies entirely on rules authored in the console |
| Supabase (Auth + Postgres + Realtime) | Open-source, Postgres gives full SQL; self-hostable | Postgres changes query patterns significantly; realtime channel model differs from Firestore listeners; push notifications need a separate service |
| AWS Amplify (Cognito + DynamoDB + SNS) | AWS ecosystem, scalable | Significantly more complex setup and SDK surface; steeper learning curve; worse DX for a solo project |
| Pocketbase | Self-hostable, lightweight | Requires a server to run; contradicts ADR-0001; less mature ecosystem |

## Decision

Use **Firebase** across the board:

- **Firebase Authentication** — email/password and social providers for family member login.
- **Cloud Firestore** — real-time NoSQL document store for all five board types (Tasks, Notices, Lost & Found, Pantry, Questions) and family space membership.
- **Firebase Cloud Messaging (FCM)** — push notifications; integrates with the PWA service worker (see ADR-0006).

## Consequences

**Positive:**
- A single SDK, a single console, and a single billing account cover all backend needs.
- Firestore real-time listeners mean the board updates across family members' devices without polling.
- FCM push works on the web via the service worker, unifying mobile and desktop notification delivery.
- The free Spark plan is sufficient for a family-scale app at this stage.

**Negative / costs:**
- **Vendor lock-in is real and significant.** Migrating off Firebase later would require rewriting auth flows, all database access code, and the push notification layer simultaneously. There is no abstraction layer that makes Firebase pluggable today.
- Firebase security rules are the only enforcement boundary. Mistakes in rules directly expose family data. Rules must be reviewed with the same rigour as server-side access control.
- Firestore's document model does not support ad-hoc joins or aggregates natively. Complex queries (e.g. "all overdue tasks across all family members") may require denormalisation or client-side merging.
- The Firebase project and configuration are **not yet set up** as of this ADR. No Firebase SDK calls will work until the human completes the steps in `human-instructions/` and the resulting config is committed.

**Deferred:**
- Firestore collection structure and security rules design — deferred to the feature implementation requirement.
- FCM server-side topic management — deferred; may require a Cloud Function when notification targeting becomes non-trivial.
