import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');
  });

  test('displays empty state when no goals exist', async ({ page }) => {
    // Should show the empty state message
    await expect(page.getByRole('heading', { name: 'No goals yet' })).toBeVisible();
    await expect(page.getByText('Get started by creating your first investment goal.')).toBeVisible();

    // Should have a create link (styled as button) - use the one in the empty state card
    await expect(page.getByRole('link', { name: 'Create Goal', exact: true })).toBeVisible();
  });

  test('has navigation header with links', async ({ page }) => {
    // Should have header
    await expect(page.getByRole('banner')).toBeVisible();

    // Should have navigation links (use navigation scope to avoid duplicates)
    // Note: desktop nav is hidden on mobile, use first() for reliability
    await expect(page.getByRole('link', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /create goal/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /timeline/i }).first()).toBeVisible();
  });

  test('can navigate to create page', async ({ page }) => {
    // Click create goal link
    await page.getByRole('link', { name: /create goal/i }).first().click();

    // Should navigate to create page
    await expect(page).toHaveURL('/create');
  });
});

test.describe('Dashboard with Goals', () => {
  const testGoals = [
    {
      id: 'goal_test_1',
      title: 'Emergency Fund',
      description: 'Build a 6-month emergency fund for unexpected expenses',
      amount: 15000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Peace of mind for my family',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_test_2',
      title: 'House Down Payment',
      description: 'Save for a down payment on our first home',
      amount: 50000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'growth',
      whyItMatters: 'Provide stability for my family',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_test_3',
      title: 'Japan Trip',
      description: 'Visit Japan for cherry blossom season',
      amount: 8000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'dream',
      whyItMatters: 'Experience a lifelong dream',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    // Set up test data in localStorage BEFORE the page loads
    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, testGoals);
    await page.goto('/');
  });

  test('displays goals in bucket sections', async ({ page }) => {
    // Should show bucket sections (bucket names in headers)
    await expect(page.getByRole('heading', { name: /safety/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /growth/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /dream/i })).toBeVisible();

    // Should show goals (using heading role to avoid matching the "Next goal" section)
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'House Down Payment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Japan Trip' })).toBeVisible();
  });

  test('displays correct stats', async ({ page }) => {
    // Should show correct total goals count in summary stats
    await expect(page.getByText('3 goals')).toBeVisible();
  });

  test('bucket sections are collapsible', async ({ page }) => {
    // Safety bucket should be expanded by default (use heading to be specific)
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();

    // Click the bucket header button to collapse Safety bucket
    const safetyButton = page.locator('button').filter({ hasText: /^Safety/ });
    await safetyButton.click();

    // Goal should be hidden
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();

    // Click to expand again
    await safetyButton.click();

    // Goal should be visible again
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
  });

  test('goal cards show priority number', async ({ page }) => {
    // Each goal card should have a priority indicator
    await expect(page.getByText('#1').first()).toBeVisible();
  });

  test('goal cards show days remaining', async ({ page }) => {
    // Should show days remaining for goals (use first() since there are multiple)
    await expect(page.getByText(/\d+ days left/).first()).toBeVisible();
  });
});
