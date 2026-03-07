import { test, expect } from '@playwright/test';

test.describe('Consent Banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    // Clear all storage so banner appears
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('appears on first visit with no prior consent', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    await expect(banner).toBeVisible();
    await expect(banner.getByText('We use anonymous analytics')).toBeVisible();
  });

  test('shows Accept All and Decline buttons', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    await expect(banner.getByRole('button', { name: /accept all/i })).toBeVisible();
    await expect(banner.getByRole('button', { name: /decline/i })).toBeVisible();
  });

  test('has links to Privacy Policy and Terms of Service', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    const privacyLink = banner.getByRole('link', { name: /privacy policy/i });
    const termsLink = banner.getByRole('link', { name: /terms of service/i });
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
    await expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('disappears after clicking Decline', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    await expect(banner).toBeVisible();

    await banner.getByRole('button', { name: /decline/i }).click();

    await expect(banner).not.toBeVisible();
  });

  test('saves consent to localStorage after Decline', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    await banner.getByRole('button', { name: /decline/i }).click();

    const consent = await page.evaluate(() => {
      const raw = localStorage.getItem('fingoal_consent');
      return raw ? JSON.parse(raw) : null;
    });
    expect(consent).not.toBeNull();
    expect(consent.given).toBe(true);
    expect(consent.analyticsConsent).toBe(false);
  });

  test('does not appear when consent already exists', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'fingoal_consent',
        JSON.stringify({ given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false })
      );
    });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: /we value your privacy/i })).not.toBeVisible();
  });

  test('does not reappear on same page after decline', async ({ page }) => {
    await page.goto('/dashboard');
    const banner = page.getByRole('dialog', { name: /we value your privacy/i });
    await banner.getByRole('button', { name: /decline/i }).click();
    await expect(banner).not.toBeVisible();

    // Verify consent was persisted in localStorage
    const consent = await page.evaluate(() => {
      const raw = localStorage.getItem('fingoal_consent');
      return raw ? JSON.parse(raw) : null;
    });
    expect(consent).not.toBeNull();
    expect(consent.given).toBe(true);
  });
});
