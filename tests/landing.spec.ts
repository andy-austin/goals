import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
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
    await page.goto('/');
  });

  test.describe('Hero Section', () => {
    test('displays hero heading and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /stop saving/i })).toBeVisible();
      await expect(page.getByText('Define, prioritize, and document your investment goals')).toBeVisible();
    });

    test('shows "Start Your First Goal" CTA for unauthenticated users', async ({ page }) => {
      const cta = page.getByRole('link', { name: /start your first goal/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', '/create');
    });

    test('shows "See How It Works" link to methodology', async ({ page }) => {
      const link = page.getByRole('link', { name: /see how it works/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', '#methodology');
    });

    test('displays goal preview card', async ({ page }) => {
      // The preview card uses an h3 heading
      await expect(page.locator('h3').filter({ hasText: 'House Down Payment' })).toBeVisible();
      await expect(page.getByText('65%').first()).toBeVisible();
      await expect(page.getByText('On Track')).toBeVisible();
    });

    test('shows trust badges', async ({ page }) => {
      await expect(page.getByText('Bank-level security')).toBeVisible();
      await expect(page.getByText('12k+ goals created')).toBeVisible();
    });
  });

  test.describe('Landing Header', () => {
    test('displays logo and nav links', async ({ page }) => {
      await expect(page.getByText('FinGoal').first()).toBeVisible();
      await expect(page.getByRole('link', { name: /methodology/i }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /calculator/i }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /features/i }).first()).toBeVisible();
    });

    test('shows "Get Started" button linking to /create', async ({ page }) => {
      const btn = page.getByRole('link', { name: /get started/i });
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute('href', '/create');
    });
  });

  test.describe('Methodology Section', () => {
    test('displays methodology heading and steps', async ({ page }) => {
      const section = page.locator('#methodology');
      await expect(section.getByRole('heading', { name: /intentional investing/i })).toBeVisible();
      await expect(section.getByText('Goal Purpose')).toBeVisible();
      await expect(section.getByText('Target Amount')).toBeVisible();
      await expect(section.getByText('Target Date')).toBeVisible();
      await expect(section.getByText('Goal Bucket')).toBeVisible();
      await expect(section.getByText('Why It Matters')).toBeVisible();
    });
  });

  test.describe('Goal Calculator', () => {
    test('displays calculator with default values', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /any goal/i })).toBeVisible();
      await expect(page.getByLabel('Target Amount')).toHaveValue('50000');
      await expect(page.getByLabel(/time horizon/i)).toHaveValue('5');
    });

    test('updates monthly savings when target amount changes', async ({ page }) => {
      // Get initial monthly savings text
      const resultCard = page.locator('#calculator');
      const initialSavings = await resultCard.getByText(/^\$/).first().textContent();

      // Change target amount
      await page.getByLabel('Target Amount').fill('100000');

      // Wait for recalculation
      await page.waitForTimeout(100);

      // Monthly savings should have changed
      const updatedSavings = await resultCard.getByText(/^\$/).first().textContent();
      expect(updatedSavings).not.toBe(initialSavings);
    });

    test('updates monthly savings when time horizon changes', async ({ page }) => {
      const resultCard = page.locator('#calculator');
      const initialSavings = await resultCard.getByText(/^\$/).first().textContent();

      await page.getByLabel(/time horizon/i).fill('10');
      await page.waitForTimeout(100);

      const updatedSavings = await resultCard.getByText(/^\$/).first().textContent();
      expect(updatedSavings).not.toBe(initialSavings);
    });

    test('currency selector changes currency symbol', async ({ page }) => {
      await page.getByLabel('Currency').selectOption('EUR');
      await page.waitForTimeout(100);

      const resultCard = page.locator('#calculator');
      await expect(resultCard.getByText(/€/).first()).toBeVisible();
    });

    test('"Create this Goal" link includes calculator values as params', async ({ page }) => {
      await page.getByLabel('Target Amount').fill('25000');
      await page.getByLabel(/time horizon/i).fill('3');
      await page.getByLabel('Currency').selectOption('EUR');

      await page.waitForTimeout(100);

      const createLink = page.getByRole('link', { name: /create this goal/i });
      await expect(createLink).toBeVisible();
      const href = await createLink.getAttribute('href');
      expect(href).toContain('amount=25000');
      expect(href).toContain('currency=EUR');
      expect(href).toContain('date=');
    });
  });

  test.describe('CTA Section', () => {
    test('displays final CTA with feature list', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /start investing with intention/i })).toBeVisible();
      // Feature items are inside the CTA gradient section
      const ctaSection = page.locator('section').filter({
        has: page.getByRole('heading', { name: /start investing with intention/i })
      });
      await expect(ctaSection.getByText('Unlimited goals')).toBeVisible();
      await expect(ctaSection.getByText('Multi-currency support')).toBeVisible();
      await expect(ctaSection.getByText('Progress tracking')).toBeVisible();
      await expect(ctaSection.getByText('Priority management')).toBeVisible();
    });

    test('CTA button links to /create', async ({ page }) => {
      const ctaButton = page.getByRole('link', { name: /create your first goal/i });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveAttribute('href', '/create');
    });
  });

  test.describe('Footer', () => {
    test('displays logo and navigation links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByRole('link', { name: 'FinGoal' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    });

    test('footer shows current year', async ({ page }) => {
      const year = new Date().getFullYear().toString();
      await expect(page.locator('footer').getByText(year)).toBeVisible();
    });

    test('privacy link navigates to /privacy', async ({ page }) => {
      await page.locator('footer').getByRole('link', { name: /privacy policy/i }).click();
      await expect(page).toHaveURL('/privacy');
    });

    test('terms link navigates to /terms', async ({ page }) => {
      await page.locator('footer').getByRole('link', { name: /terms of service/i }).click();
      await expect(page).toHaveURL('/terms');
    });
  });
});
