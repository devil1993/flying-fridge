# 04 — Push to GitHub & deploy to GitHub Pages

**Why:** the repo has a deploy workflow (`.github/workflows/deploy-pages.yml`)
that builds the app and publishes it to **GitHub Pages** on every push to
`main`. Nothing is pushed from the dev environment automatically — these are the
one-time human steps to get it live.

Your site will be served at:

```
https://<your-github-username>.github.io/<repo-name>/
```

e.g. `https://devil1993.github.io/flying-fridge/`. The build derives the
sub-path from the repo name automatically — no config to edit.

---

## 1. Create the GitHub repo and push (one-time)

If the repo doesn't exist on GitHub yet, create it (public — GitHub Pages for a
project site needs a public repo, or GitHub Pro for private Pages), then from the
project folder:

```bash
git remote add origin https://github.com/<username>/<repo-name>.git

# The workflows (CI + deploy) run on the `main` branch. Local work here is on
# `master`, so push it to `main`:
git push -u origin master:main
```

> Already have a remote / are on `main`? Just `git push`. The key requirement is
> that a branch named **`main`** receives the commits — that's what both
> `ci.yml` and `deploy-pages.yml` trigger on.

## 2. Turn on Pages (one-time)

1. GitHub → your repo → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   (Do *not* pick "Deploy from a branch" — this project deploys via the Action.)

That's it. The next push to `main` runs the **Deploy to GitHub Pages** workflow;
when it finishes, the **Actions** tab / the `github-pages` environment shows the
live URL.

## 3. (Optional) Firebase config for the deployed app

Without this, the deployed site still works — it just runs **signed-out / demo
mode** (landing, guide, in-memory boards). To enable real auth + Firestore +
notifications on the live site, add the public web-config values as repo
**Secrets** (Settings → **Secrets and variables** → **Actions** → *New
repository secret*). Same names as `.env.local`:

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

These are Firebase's **public** web config (safe to expose in a client bundle);
access is controlled by Security Rules, not by hiding these.

Then, in the Firebase console:

- **Authentication → Settings → Authorized domains:** add
  `<username>.github.io` so Google/Email sign-in works from the live site.
- **Firestore rules:** make sure they're published (see
  `02-firestore-security-rules.md`) and a family is bootstrapped (`03`).

## 4. How it redeploys

- **Every push to `main`** → build → publish. No manual step after setup.
- You can also trigger it by hand: **Actions → Deploy to GitHub Pages → Run
  workflow** (that's the `workflow_dispatch` trigger).

## Notes

- **SPA routing & base path are handled for you:** the build sets Vite's `base`
  to `/<repo>/`, the router picks it up via `BASE_URL`, and a `404.html`
  (a copy of `index.html`) lets deep links like `/<repo>/guide` boot the app.
- **CI vs deploy:** `ci.yml` runs lint/typecheck/test/build on PRs and `main`;
  `deploy-pages.yml` is the one that publishes. A red CI doesn't block the
  deploy job — keep an eye on both.
- **Custom domain later?** If you add one, the base becomes `/`; set
  `VITE_BASE=/` for that build (and update the router accordingly).
