# E2E tests (Playwright)

E2E tests for Singular Stories dashboard with Playwright, TypeScript, and Allure reports.

## Quick start

```bash
npm install
npx playwright install   # one-time: install browsers
npm run auth:setup       # one-time: log in with Google, saves session to auth/user.json
```

## Run locally and check it works

```bash
npx playwright test --project=chromium
```

With browser visible:

```bash
npx playwright test --headed --project=chromium
```

## Allure reports (with history)

Allure report uses your **past runs** as history (trends, previous results). You need **Java 8+** for report generation.

**One command: run tests → generate report → open in browser**

```bash
npm run test:allure           # headless (chromium + firefox + webkit)
npm run test:allure:headed     # browser visible (same 3 browsers)
```

Use `test:allure:headed` for headed — `npm run test:allure --headed` does not pass `--headed` to Playwright.

**Or step by step:**

```bash
npx playwright test                    # run tests (writes to allure-results/)
npm run allure:generate               # generate report (keeps history from previous runs)
npm run allure:open                   # open report in browser
```

- **History**: Before each generate, the script copies the previous report’s `history` into `allure-results`, then generates with `--clean`. So multiple runs show up as history/trends in the report.
- **Fresh report**: To start with no history, use `npm run allure:generate:fresh`.
- **Quick preview**: `npm run allure:serve` generates a temporary report and opens it (no history).

## CI/CD

- **GitHub Actions**: runs on push to `main`/`master`, daily schedule, and manual run.
- **Live report**: **Playwright HTML report** is deployed to GitHub Pages (no 404s; links work at `/e2e-test/`).
- **Artifacts**: Playwright report and Allure results are uploaded so you can download either.
- **Auth in CI**: set secret `PLAYWRIGHT_AUTH_STATE` (base64 of `auth/user.json`) and variable `AUTH_IN_CI=true`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run tests (headless) |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:allure` | Run tests → generate Allure report → open (with history) |
| `npm run test:allure:headed` | Same as test:allure but with browser visible |
| `npm run auth:setup` | Log in with Google and save session for CI/local |
| `npm run report` | Open last Playwright HTML report |
| `npm run allure:generate` | Generate Allure report (copies previous history in, then generates so trends are kept) |
| `npm run allure:generate:fresh` | Generate Allure report from scratch (no history) |
| `npm run allure:open` | Open last generated Allure report |
| `npm run allure:serve` | Generate temporary report and open (no history) |
