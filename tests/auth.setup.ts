import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * One-time auth setup: run this to log in with Google and save session.
 *
 * 1. Run: npx playwright test tests/auth.setup.ts --headed --project=auth-setup
 * 2. Browser opens; you’ll be sent to Google sign-in. Log in as usual.
 * 3. When you’re on the dashboard, go back to the terminal and press Enter
 *    (or resume from the Playwright Inspector if it’s open).
 * 4. Session is saved to auth/user.json. Normal tests will use it automatically.
 *
 * Re-run this when the session expires (e.g. after a few days or 401/redirect to login).
 */
test('save Google login state', async ({ page }) => {
  await page.goto('/t-dashboard', { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // Pause so you can complete Google sign-in in the browser.
  // When you’re on the dashboard, press Enter in the terminal (or click Resume in the Inspector).
  await page.pause();

  const authDir = path.join(process.cwd(), 'auth');
  fs.mkdirSync(authDir, { recursive: true });
  await page.context().storageState({ path: path.join(authDir, 'user.json') });
});
