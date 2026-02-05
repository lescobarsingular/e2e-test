import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('visits the dashboard page', async ({ page }) => {
    await page.goto('/t-dashboard', {
      waitUntil: 'domcontentloaded', // don't wait for every asset; page may have slow scripts
      timeout: 60_000,
    });

    await expect(page).toHaveURL(/singular-stories.com/);
    await expect(page).toHaveTitle(/Singular Stories/); // page has some title
  });
});
