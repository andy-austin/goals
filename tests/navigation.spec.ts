import { test, expect } from '@playwright/test';

const consentData = JSON.stringify({
  given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false
});

test.describe('Header Navigation (unauthenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
    await page.goto('/dashboard');
  });

  test('displays logo linking to dashboard', async ({ page }) => {
    const logo = page.locator('header').getByRole('link').filter({ hasText: 'FinGoal' });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/dashboard');
  });

  test('shows Dashboard nav link', async ({ page }) => {
    await expect(page.locator('header nav').getByRole('link', { name: /dashboard/i })).toBeVisible();
  });

  test('shows Create Goal nav link', async ({ page }) => {
    await expect(page.locator('header nav').getByRole('link', { name: /create goal/i })).toBeVisible();
  });

  test('Dashboard link navigates to /dashboard', async ({ page }) => {
    await page.goto('/create');
    await page.locator('header nav').getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('Create Goal link navigates to /create', async ({ page }) => {
    await page.locator('header nav').getByRole('link', { name: /create goal/i }).click();
    await expect(page).toHaveURL('/create');
  });

  test('shows Sign In button for unauthenticated users', async ({ page }) => {
    const signIn = page.locator('header').getByRole('link', { name: /sign in/i });
    await expect(signIn).toBeVisible();
    await expect(signIn).toHaveAttribute('href', '/auth/login');
  });

  test('Sign In button navigates to login page', async ({ page }) => {
    await page.locator('header').getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/auth/login');
  });
});

test.describe('Header Navigation - Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
    await page.goto('/dashboard');
  });

  test('displays language switcher with flag buttons', async ({ page }) => {
    const langGroup = page.getByRole('group', { name: /language/i });
    await expect(langGroup).toBeVisible();
    // Should have two flag buttons (EN and ES)
    await expect(langGroup.getByRole('button')).toHaveCount(2);
  });

  test('switching to Spanish updates page content', async ({ page }) => {
    // Verify we start in English
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Click the Spanish flag button
    const langGroup = page.getByRole('group', { name: /language/i });
    await langGroup.getByRole('button').nth(1).click();

    // Wait for page to update
    await page.waitForTimeout(500);

    // Dashboard heading should no longer be "Dashboard" (it's a different locale now)
    // The page should show Spanish content
    await expect(page.getByRole('heading', { name: 'Dashboard' })).not.toBeVisible();
  });
});

test.describe('Header Navigation - Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
  });

  test('shows mobile menu toggle button', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /toggle navigation menu/i });
    await expect(menuBtn).toBeVisible();
  });

  test('opens mobile menu on toggle click', async ({ page }) => {
    await page.getByRole('button', { name: /toggle navigation menu/i }).click();

    // Mobile nav should now be visible
    await expect(page.getByRole('link', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /create goal/i }).first()).toBeVisible();
  });

  test('mobile menu shows Sign In for unauthenticated users', async ({ page }) => {
    await page.getByRole('button', { name: /toggle navigation menu/i }).click();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('mobile nav link navigates to /create', async ({ page }) => {
    await page.getByRole('button', { name: /toggle navigation menu/i }).click();
    await page.getByRole('link', { name: /create goal/i }).first().click();
    await expect(page).toHaveURL('/create');
  });
});

test.describe('Landing Header - Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('shows mobile menu toggle on landing page', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /toggle navigation menu/i });
    await expect(menuBtn).toBeVisible();
  });

  test('opens landing mobile menu with nav items', async ({ page }) => {
    await page.getByRole('button', { name: /toggle navigation menu/i }).click();

    await expect(page.getByRole('link', { name: /methodology/i }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /calculator/i }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /features/i }).last()).toBeVisible();
  });
});
