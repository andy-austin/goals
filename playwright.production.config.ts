import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, 'tests/setup/.auth/user.json');

/**
 * Production E2E config — runs authenticated tests against the live Vercel deployment.
 *
 * Usage:
 *   npx playwright test --config=playwright.production.config.ts
 *
 * Credentials (set via env vars or defaults to the shared test account):
 *   TEST_USER_EMAIL    (default: yan4talk@gmail.com)
 *   TEST_USER_PASSWORD (default: jlf8821r)
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/authenticated.spec.ts'],
  fullyParallel: false,
  retries: 1,
  timeout: 60000,
  reporter: 'html',
  use: {
    baseURL: 'https://investment-goals.vercel.app',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['setup'],
    },
  ],
});
