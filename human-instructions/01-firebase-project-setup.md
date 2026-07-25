# 01 — Firebase Project Setup

**Goal:** create the Firebase project that Flying Fridge runs on, turn on the pieces we need (Authentication, Cloud Firestore, Cloud Messaging), and copy the connection values into the workspace so the app can talk to it.

**Who this is for:** you have a Google account but may be new to Firebase. Every step says what to click and what to copy. Take your time — this is a one-time setup.

**Time needed:** about 15–20 minutes.

**What you'll produce by the end:**
- A live Firebase project.
- Email/Password and Google sign-in enabled.
- A Cloud Firestore database.
- A Web Push (VAPID) key for notifications.
- A file named `.env.local` in the project root, filled in with 8 values.

> **A note on "secrets":** The `VITE_FIREBASE_*` values you'll copy are **public identifiers**, not passwords. They ship inside any frontend build and are safe to expose — they say *which* project to talk to, they do not *grant access* to your data. Real protection comes later from **Firestore Security Rules** (a future requirement). So don't worry that these values end up in the browser; that's by design.

---

## Step 1 — Open the Firebase console

1. Go to **https://console.firebase.google.com/**.
2. Sign in with your Google account if prompted.
3. You'll land on the Firebase console home, which lists your projects (probably empty for now).

---

## Step 2 — Create the project

1. Click **"Create a project"** (or **"Add project"** if you already have others).
2. **Project name:** type something like `flying-fridge`. Firebase will generate a unique **Project ID** underneath (e.g. `flying-fridge-1a2b3`) — that ID is permanent, so glance at it but you don't need to memorize it.
3. Click **Continue**.
4. **Google Analytics screen:** you'll be asked whether to enable Google Analytics for this project.
   - **Recommendation: turn Google Analytics OFF** for now (toggle it off). We don't need analytics for the initial build, and it keeps setup simpler. You can add it later if you ever want usage metrics.
   - (If you leave it on, you'll be asked to pick or create an Analytics account — that's fine too, just extra steps. The app has a slot for a `measurementId` either way.)
5. Click **Create project**. Wait for the "Your new project is ready" message, then click **Continue**.

You are now inside your project's dashboard.

---

## Step 3 — Register a Web app and copy the config

Flying Fridge is a web app, so we register it as a **Web app**.

1. On the project **Overview / dashboard** page, find the row of platform icons near the top ("Get started by adding Firebase to your app").
2. Click the **`</>`** icon (that's the **Web** platform).
3. **App nickname:** type something like `Flying Fridge Web`. This is just a label for you.
4. **Firebase Hosting checkbox:** you can **leave it unchecked** for now (we'll decide on hosting in a later requirement).
5. Click **Register app**.
6. Firebase now shows you a code snippet containing a **`firebaseConfig`** object. It looks like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "flying-fridge-1a2b3.firebaseapp.com",
     projectId: "flying-fridge-1a2b3",
     storageBucket: "flying-fridge-1a2b3.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"   // only present if you enabled Analytics
   };
   ```

7. **Keep this tab open** (or copy the whole `firebaseConfig` block into a scratch note). You'll paste these values into `.env.local` in Step 7.
8. Click **Continue to console**.

> **Lost the config later?** No problem. Go to **⚙ (gear icon) → Project settings → General tab**, scroll to **"Your apps"**, pick your web app, and you'll see the same `firebaseConfig` under **SDK setup and configuration → Config**.

---

## Step 4 — Enable Authentication

1. In the **left sidebar**, click **Build → Authentication**.
2. Click **Get started**. This opens the **Sign-in method** area.
3. You'll see a list of **Sign-in providers**. Enable these two to start:

   **Email/Password**
   - Click the **Email/Password** row.
   - Toggle **Enable** on (the first toggle). You can leave "Email link (passwordless sign-in)" off.
   - Click **Save**.

   **Google**
   - Click **Add new provider** (or find **Google** in the list) and click the **Google** row.
   - Toggle **Enable** on.
   - Set a **Project public-facing name** (e.g. `Flying Fridge`) and pick a **Project support email** (your email should be in the dropdown).
   - Click **Save**.

4. You should now see **Email/Password** and **Google** listed with status **Enabled**.

> We start with these two because they cover the common cases (a plain email login and a one-tap Google login). You can add more providers later.

---

## Step 5 — Create the Cloud Firestore database

This is the database that stores tasks, notices, pantry items, etc.

1. In the **left sidebar**, click **Build → Firestore Database**.
2. Click **Create database**.
3. **Security rules mode:** choose **Start in production mode**.
   - **Recommendation: production mode.** It locks the database down by default (no open access). We'll write proper **Security Rules** in a later requirement to control exactly who can read/write. (Test mode leaves the database open to the world for 30 days — we don't want that.)
   - Click **Next**.
4. **Location / region:** pick the region closest to where the family lives (e.g. `europe-west` for Europe, `us-central` for the US, `asia-south` for India).
   - **⚠ This choice is PERMANENT** — you cannot move a Firestore database to another region later without recreating it. Pick deliberately.
5. Click **Enable** (or **Create**). Wait for the database to be provisioned.

You'll land on an empty Firestore data viewer. That's expected — the app will create data later.

> **Note it down:** remember which region you chose. You'll report it back at the end.

---

## Step 6 — Enable Cloud Messaging and generate the VAPID key

Cloud Messaging (FCM) powers **push notifications**. For web push, we need a **Web Push certificate**, also called a **VAPID key pair**.

1. Click the **⚙ gear icon** next to "Project Overview" (top-left) → **Project settings**.
2. Open the **Cloud Messaging** tab.
3. Scroll to the **Web configuration → Web Push certificates** section.
4. Click **Generate key pair**.
5. A key appears — a long string starting with something like `BODk...`. This is your **VAPID public key**.
6. **Copy it.** This becomes `VITE_FIREBASE_VAPID_KEY` in Step 7.

> If the Cloud Messaging API looks disabled or you see a prompt to enable it, follow the on-screen link to enable **"Firebase Cloud Messaging API (V1)"**, then come back and generate the key pair.

---

## Step 7 — Wire the values into the workspace (`.env.local`)

Now we connect Firebase to the app by creating a **`.env.local`** file in the **project root** (the same folder that contains `package.json`).

1. In the project root, **create a new file named exactly `.env.local`** (note the leading dot).
   - This file is **gitignored** — it will **not** be committed to the repository. That's intentional; each developer keeps their own local copy.
2. Paste the following template into it, then fill in the value after each `=` from your Firebase config (Step 3) and your VAPID key (Step 6):

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   VITE_FIREBASE_VAPID_KEY=
   ```

3. **How to map each Firebase config field to the variable:**

   | From `firebaseConfig` (Step 3) | Paste into this variable |
   | --- | --- |
   | `apiKey` | `VITE_FIREBASE_API_KEY` |
   | `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `VITE_FIREBASE_PROJECT_ID` |
   | `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId` | `VITE_FIREBASE_APP_ID` |
   | `measurementId` | `VITE_FIREBASE_MEASUREMENT_ID` |
   | *(the VAPID key from Step 6)* | `VITE_FIREBASE_VAPID_KEY` |

4. **Rules for the values:**
   - Put the value **directly after the `=`**, with **no spaces** and **no quotes**. Example: `VITE_FIREBASE_PROJECT_ID=flying-fridge-1a2b3`.
   - Every line must be filled in **except** `VITE_FIREBASE_MEASUREMENT_ID` — leave that one **empty if you turned Google Analytics off** (there'll be no `measurementId`). That's fine; the app treats it as optional.
5. **Save** the file.

A filled-in example (values are illustrative — use YOUR own):

```
VITE_FIREBASE_API_KEY=AIzaSyD-EXAMPLE-1234567890
VITE_FIREBASE_AUTH_DOMAIN=flying-fridge-1a2b3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=flying-fridge-1a2b3
VITE_FIREBASE_STORAGE_BUCKET=flying-fridge-1a2b3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FIREBASE_VAPID_KEY=BODk-EXAMPLE-verylongstring...
```

> **Heads-up — a second copy is needed later.** Background push notifications run in a **service worker** file called `public/firebase-messaging-sw.js`. Service workers can't read `.env.local`, so the **same public config values** (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId — **not** the VAPID key) will need to be written into that file too. **You don't have to do this now** — a later step/requirement will wire it up. Just be aware it's coming, so it won't surprise you.

---

## Step 8 — Authorized domains (quick check, nothing to change now)

Firebase Authentication only allows sign-in from **authorized domains**.

1. Go to **Authentication → Settings** tab → **Authorized domains**.
2. You'll see **`localhost`** already in the list. That's all you need for local development — sign-in will work while you run the app on your machine.
3. **Later**, when you deploy the app to a real URL, come back here and click **Add domain** to add your deploy domain (e.g. `flying-fridge.web.app` or your custom domain). Skip this for now.

---

## What to report back

When you're done, tell the assistant the following so the next requirement can proceed:

- [ ] **Auth providers enabled:** confirm **Email/Password** and **Google** are both enabled (or note any differences).
- [ ] **Firestore region:** which region did you choose? (e.g. `europe-west1`)
- [ ] **Analytics:** did you enable Google Analytics (yes/no)? (Tells us whether `measurementId` exists.)
- [ ] **`.env.local`:** confirm the file exists in the project root and all applicable variables are filled in (all 8, or 7 if you skipped `measurementId`).

You do **not** need to paste the actual values to the assistant — they live safely in your local `.env.local`. Just confirm the checklist above.

---

## Troubleshooting & verification

**How will I know it worked?**
You won't see a result immediately — this guide only sets up Firebase and fills in `.env.local`. The **payoff comes in a later step**, when the app wires Firebase in code. At that point:

- Running the app (`pnpm dev`) and opening it should connect without "Firebase not configured" errors.
- You'll be able to sign up / sign in using Email/Password or Google.
- If the app logs your Firebase project ID or a "connected" message, that confirms the config was read correctly.

**Common issues:**

- **"Firebase: Error (auth/configuration-not-found)" or app can't connect.** Usually a typo in `.env.local`. Re-check that each value matches the console exactly, has no surrounding quotes or spaces, and that the file is named `.env.local` (not `env.local` or `.env.local.txt`).
- **Changes to `.env.local` don't take effect.** Vite reads env files at startup — **stop and restart the dev server** after editing `.env.local`.
- **Google sign-in popup blocked or errors on `localhost`.** Make sure `localhost` is in **Authentication → Settings → Authorized domains** (it's there by default).
- **Can't find the `firebaseConfig` again.** ⚙ → **Project settings → General → Your apps →** your web app → **Config**.
- **No `measurementId` in your config.** That's expected if you turned Analytics off. Leave `VITE_FIREBASE_MEASUREMENT_ID=` empty.
- **VAPID key section is empty / "Generate key pair" missing.** Enable the **Firebase Cloud Messaging API (V1)** via the link Firebase shows, then reload the Cloud Messaging tab.

Once the checklist is reported back, you're clear to move on to the next requirement.
