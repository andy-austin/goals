import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem(
        'fingoal_consent',
        JSON.stringify({ given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false })
      );
    });
    await page.goto('/privacy');
  });

  test('displays page title and last updated date', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByText(/last updated/i)).toBeVisible();
  });

  test('displays all required sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Data We Collect' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How We Use Data' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Sharing' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /data retention/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Rights' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  });

  test('has "Back to FinGoal" link navigating to home', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /fingoal/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/');
  });

  test('displays local data and analytics subsections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Goal Data (Local Only)', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Anonymous Analytics', level: 3 })).toBeVisible();
  });
});

test.describe('Terms of Service Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem(
        'fingoal_consent',
        JSON.stringify({ given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false })
      );
    });
    await page.goto('/terms');
  });

  test('displays page title and last updated date', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
    await expect(page.getByText(/last updated/i)).toBeVisible();
  });

  test('displays all required sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Description of Service' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Not Financial Advice' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'User Responsibilities' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /disclaimer/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /limitation of liability/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /changes/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  });

  test('has "Back to FinGoal" link navigating to home', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /fingoal/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/');
  });

  test('shows "Not Financial Advice" section with warning styling', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Not Financial Advice' })
    });
    await expect(section).toBeVisible();
    // The section has a distinct border-l-4 warning style
    await expect(section.getByText(/not a licensed financial advisor/i)).toBeVisible();
  });
});
