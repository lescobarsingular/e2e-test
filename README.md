# E2E tests (Playwright)

E2E tests for Singular Stories dashboard with Playwright, TypeScript, and Allure reports.

## Quick start

```bash
npm install
npx playwright install   # one-time: install browsers
npm run auth:setup        # one-time: log in with Google, saves session to auth/user.json
npx playwright test       # run tests (headless)
npx playwright test --headed   # run with browser visible
```

## CI/CD

- **GitHub Actions**: runs on push to `main`/`master`, daily schedule, and manual run.
- **Allure reports**: published to GitHub Pages (branch `gh-pages`).
- **Auth in CI**: set secret `PLAYWRIGHT_AUTH_STATE` (base64 of `auth/user.json`) and variable `AUTH_IN_CI=true`.

See [docs/CI.md](docs/CI.md) for full setup and refresh instructions.

## Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run tests (headless) |
| `npm run test:headed` | Run tests with browser visible |
| `npm run auth:setup` | Log in with Google and save session for CI/local |
| `npm run report` | Open last Playwright HTML report |
| `npm run allure:generate` | Generate Allure report from `allure-results/` (requires Allure CLI) |
| `npm run allure:open` | Open Allure report (requires Allure CLI) |
