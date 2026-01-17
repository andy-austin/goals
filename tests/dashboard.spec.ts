import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('displays empty state when no goals exist', async ({ page }) => {
    await page.goto('/');

    // Should show the empty state message
    await expect(page.getByText('No goals yet')).toBeVisible();
    await expect(page.getByText('Get started by creating your first investment goal.')).toBeVisible();

    // Should have a create button
    await expect(page.getByRole('button', { name: /create goal/i })).toBeVisible();
  });

  test('displays stats cards', async ({ page }) => {
    await page.goto('/');

    // Should show stats cards
    await expect(page.getByText('Total Goals')).toBeVisible();
    await expect(page.getByText('Total Target')).toBeVisible();
    await expect(page.getByText('Buckets')).toBeVisible();
  });

  test('has navigation header with links', async ({ page }) => {
    await page.goto('/');

    // Should have header
    await expect(page.getByRole('banner')).toBeVisible();

    // Should have navigation links (use navigation scope to avoid duplicates)
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /create/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /timeline/i })).toBeVisible();
  });

  test('can navigate to create page', async ({ page }) => {
    await page.goto('/');

    // Click create goal link
    await page.getByRole('link', { name: /create/i }).first().click();

    // Should navigate to create page
    await expect(page).toHaveURL('/create');
  });
});

test.describe('Dashboard with Goals', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const testGoals = [
        {
          id: 'goal_test_1',
          title: 'Emergency Fund',
          description: 'Build a 6-month emergency fund for unexpected expenses',
          amount: 15000,
          currency: 'USD',
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
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
          targetDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 years from now
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
          targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          bucket: 'dream',
          whyItMatters: 'Experience a lifelong dream',
          priority: 1,
          createdAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals: testGoals })
      );
    });
    await page.reload();
  });

  test('displays goals in bucket sections', async ({ page }) => {
    await page.goto('/');

    // Should show bucket sections
    await expect(page.getByText('Safety')).toBeVisible();
    await expect(page.getByText('Growth')).toBeVisible();
    await expect(page.getByText('Dream')).toBeVisible();

    // Should show goals
    await expect(page.getByText('Emergency Fund')).toBeVisible();
    await expect(page.getByText('House Down Payment')).toBeVisible();
    await expect(page.getByText('Japan Trip')).toBeVisible();
  });

  test('displays correct stats', async ({ page }) => {
    await page.goto('/');

    // Should show correct total goals count
    await expect(page.locator('text=Total Goals').locator('..').getByText('3')).toBeVisible();

    // Total amount should be $73,000
    await expect(page.getByText('$73,000.00')).toBeVisible();
  });

  test('bucket sections are collapsible', async ({ page }) => {
    await page.goto('/');

    // Safety bucket should be expanded by default
    await expect(page.getByText('Emergency Fund')).toBeVisible();

    // Click to collapse Safety bucket
    await page.getByRole('button', { name: /safety/i }).click();

    // Goal should be hidden
    await expect(page.getByText('Emergency Fund')).not.toBeVisible();

    // Click to expand again
    await page.getByRole('button', { name: /safety/i }).click();

    // Goal should be visible again
    await expect(page.getByText('Emergency Fund')).toBeVisible();
  });

  test('goal cards show priority number', async ({ page }) => {
    await page.goto('/');

    // Each goal card should have a priority indicator
    await expect(page.getByText('#1').first()).toBeVisible();
  });

  test('goal cards show days remaining', async ({ page }) => {
    await page.goto('/');

    // Should show days remaining for goals (use first() since there are multiple)
    await expect(page.getByText(/\d+ days left/).first()).toBeVisible();
  });
});
