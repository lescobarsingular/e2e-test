# CI/CD (GitHub Actions)

The workflow runs Playwright tests and publishes Allure reports. It can run **every day** and on push to `main`/`master`.

## What the workflow does

- **Triggers**: Push to `main`/`master`, daily schedule (00:00 UTC), and manual run
- **Tests**: Playwright e2e with Chromium
- **Reports**: Allure results → HTML report → GitHub Pages; Playwright report as artifact
- **Auth**: Uses saved session from secret so tests run logged in (no Google login in CI)

## How auth works (you don’t log in in CI)

- **`page.pause()` and auth-setup** are only for **your machine**. You run `npm run auth:setup` once (or when the session expires). The browser opens, you log in with Google, then you click Resume. That saves cookies to `auth/user.json`. CI **never** runs that test and **never** uses `page.pause()`.
- **In CI**: The workflow takes a **copy** of that session: you put the contents of `auth/user.json` (base64) in a GitHub secret. Before tests run, the workflow writes that back to `auth/user.json` on the runner. So tests start **already logged in** — no Google, no browser login, no pause.
- **Keeping it working**: When the session expires (e.g. after a few weeks), you run `npm run auth:setup` again **locally**, get a new `auth/user.json`, update the GitHub secret with the new base64. CI then keeps working until the next expiry.

So: **log in once (or when expired) on your machine → save to secret → CI reuses that file.** No logging in inside GitHub Actions.

## Making daily runs work: auth in CI

### One-time setup

1. **Create the auth file locally** (you already did this):
   ```bash
   npm run auth:setup
   ```
   Log in with Google in the browser, then resume so it saves `auth/user.json`.

2. **Encode it for GitHub** (secret size limit ~64KB; if your file is larger, see below):
   ```bash
   base64 auth/user.json | pbcopy   # macOS: copies to clipboard
   # or
   base64 auth/user.json > auth-base64.txt
   ```

3. **Add a GitHub secret**
   - Repo → Settings → Secrets and variables → Actions
   - New repository secret: name `PLAYWRIGHT_AUTH_STATE`, value = pasted base64 string

4. **Turn on auth in CI**
   - Same page: Variables tab
   - New repository variable: name `AUTH_IN_CI`, value `true`

5. **Enable GitHub Pages** (for Allure report)
   - Repo → Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / root (or `/ (root)`)

After the first run, the workflow will create the `gh-pages` branch with the report. The report URL will be:  
`https://<your-username>.github.io/<repo-name>/`

### When the session expires

Saved sessions (cookies) expire (often 7–30 days). When CI starts failing with redirects to login:

1. Regenerate the auth file locally:
   ```bash
   npm run auth:setup
   ```
2. Encode and update the secret again (step 2–3 above). No need to change the variable.

So **yes, it’s possible** to run every day: you refresh the secret when the session expires (e.g. every few weeks).

### If `auth/user.json` is bigger than ~64KB

GitHub secrets are limited in size. Options:

- **Split secret**: Use two secrets (e.g. `PLAYWRIGHT_AUTH_STATE_1`, `PLAYWRIGHT_AUTH_STATE_2`) and in the workflow `cat` them before `base64 -d`.
- **Compress**: `gzip -c auth/user.json | base64` and in the workflow `base64 -d | gunzip > auth/user.json`.

## Allure report

- **Local**: After `npx playwright test`, generate and open:
  ```bash
  npx allure generate allure-results -o allure-report --clean
  npx allure open allure-report
  ```
- **CI**: The workflow generates the report and publishes it to GitHub Pages (branch `gh-pages`). History is kept so you get trends over runs.

## Artifacts

Each run uploads:

- **playwright-report**: Playwright’s HTML report (trace, screenshots).
- **allure-results**: Raw Allure results (e.g. for local report generation).

Both are kept for 14 days.

## Running only on schedule (no push)

To run **only** on the daily schedule (and manual), remove the `push` block from `on` in `.github/workflows/playwright.yml`. To keep both, leave the file as is.
