import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join(process.cwd(), 'auth', 'user.json');
const useStorageState = fs.existsSync(authFile) ? { storageState: authFile } : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'],
    ['html'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  timeout: 60_000, // 60s per test (default 30s was too short for dashboard load)
  use: {
    baseURL: 'https://www.singular-stories.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 60_000, // allow up to 60s for page loads
    ...useStorageState,
  },
  projects: [
    // Run once to log in and save session: npx playwright test tests/auth.setup.ts --headed --project=auth-setup
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined, // never load saved state so we can log in fresh
      },
    },
    // Normal tests: use saved auth from top-level use when auth/user.json exists
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /auth\.setup\.ts/,
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: /auth\.setup\.ts/ },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: /auth\.setup\.ts/ },
  ],
});
