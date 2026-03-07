import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '.auth/user.json');

/**
 * Logs in as the test user and saves the Supabase session (cookies + localStorage)
 * to a file that is reused by all tests in playwright.production.config.ts.
 */
setup('authenticate as test user', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');

  // Switch to English if the page rendered in Spanish
  const usBtn = page.locator('button').filter({ hasText: '🇺🇸' }).first();
  if (await usBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await usBtn.click();
    await page.waitForLoadState('networkidle');
  }

  // Dismiss consent banner if present
  const acceptBtn = page.getByRole('button', { name: /accept all/i });
  if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptBtn.click();
  }

  // Use type-based selectors so they work regardless of locale
  await page.locator('input[type="email"]').fill(
    process.env.TEST_USER_EMAIL ?? 'yan4talk@gmail.com'
  );
  await page.locator('input[type="password"]').fill(
    process.env.TEST_USER_PASSWORD ?? 'jlf8821r'
  );

  await page.getByRole('button', { name: /sign in|iniciar sesión/i }).click();

  // Wait for the dashboard redirect — confirms a successful login
  await page.waitForURL('**/dashboard', { timeout: 15000 });

  // Explicitly set consent in localStorage so the banner never blocks tests.
  // This must happen after navigation so we're on the correct origin.
  await page.evaluate(() => {
    localStorage.setItem(
      'fingoal_consent',
      JSON.stringify({
        given: true,
        timestamp: '2025-01-01T00:00:00.000Z',
        policyVersion: '1.0.0',
        analyticsConsent: false,
      })
    );
  });

  // Save session cookies + Supabase tokens + consent state
  await page.context().storageState({ path: authFile });
});
