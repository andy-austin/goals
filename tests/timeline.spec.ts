import { test, expect } from '@playwright/test';

// Helper to create test goals with specific dates
function createTestGoals() {
  const today = new Date();

  // Goal 6 months from now (Safety)
  const sixMonths = new Date(today);
  sixMonths.setMonth(sixMonths.getMonth() + 6);

  // Goal 2 years from now (Growth)
  const twoYears = new Date(today);
  twoYears.setFullYear(twoYears.getFullYear() + 2);

  // Goal 8 years from now (Dream)
  const eightYears = new Date(today);
  eightYears.setFullYear(eightYears.getFullYear() + 8);

  return [
    {
      id: 'goal-1',
      title: 'Emergency Fund',
      description: 'Build a safety net covering 6 months of expenses',
      amount: 15000,
      currency: 'USD',
      targetDate: sixMonths.toISOString(),
      bucket: 'safety',
      whyItMatters: 'Peace of mind and financial security',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-2',
      title: 'House Down Payment',
      description: 'Save for a 20% down payment on a home',
      amount: 60000,
      currency: 'USD',
      targetDate: twoYears.toISOString(),
      bucket: 'growth',
      whyItMatters: 'Provide stability for my family',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-3',
      title: 'Dream Vacation',
      description: 'Two week trip to Japan',
      amount: 10000,
      currency: 'USD',
      targetDate: eightYears.toISOString(),
      bucket: 'dream',
      whyItMatters: 'Experience a dream destination',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
  ];
}

test.describe('Timeline Visualization', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test goals via localStorage
    const testGoals = createTestGoals();
    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, testGoals);
    await page.goto('/timeline');
  });

  test('displays timeline page with header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
    await expect(page.getByText('Visualize your goals and milestones over time')).toBeVisible();
  });

  test('shows zoom controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: '1 Year' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 Years' })).toBeVisible();
    await expect(page.getByRole('button', { name: '10+ Years' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  });

  test('displays goals count', async ({ page }) => {
    await expect(page.getByText('3 goals')).toBeVisible();
  });

  test('shows today marker', async ({ page }) => {
    await expect(page.getByText('Today')).toBeVisible();
  });

  test('shows bucket legend', async ({ page }) => {
    await expect(page.getByText('Safety')).toBeVisible();
    await expect(page.getByText('Growth')).toBeVisible();
    await expect(page.getByText('Dream')).toBeVisible();
  });

  test('zoom controls change active state', async ({ page }) => {
    // Default should be 5 Years
    const fiveYearsBtn = page.getByRole('button', { name: '5 Years' });
    await expect(fiveYearsBtn).toHaveAttribute('aria-pressed', 'true');

    // Click 1 Year
    const oneYearBtn = page.getByRole('button', { name: '1 Year' });
    await oneYearBtn.click();
    await expect(oneYearBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(fiveYearsBtn).toHaveAttribute('aria-pressed', 'false');

    // Click 10+ Years
    const tenYearsBtn = page.getByRole('button', { name: '10+ Years' });
    await tenYearsBtn.click();
    await expect(tenYearsBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(oneYearBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('displays goal markers with titles', async ({ page }) => {
    // Goals should be visible as markers
    await expect(page.getByRole('button', { name: /Emergency Fund/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /House Down Payment/i })).toBeVisible();
  });

  test('clicking goal marker opens detail modal', async ({ page }) => {
    // Click on Emergency Fund goal
    await page.getByRole('button', { name: /Emergency Fund/i }).click();

    // Modal should appear with goal details
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    await expect(page.getByText('$15,000')).toBeVisible();
    await expect(page.getByText('Peace of mind and financial security')).toBeVisible();
  });

  test('modal can be closed', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /Emergency Fund/i }).click();
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();

    // Close via X button
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();
  });

  test('hovering goal shows tooltip', async ({ page }) => {
    // Hover over a goal marker
    const goalMarker = page.getByRole('button', { name: /Emergency Fund/i });
    await goalMarker.hover();

    // Tooltip should appear
    await expect(page.getByRole('tooltip')).toBeVisible();
  });
});

test.describe('Timeline - Empty State', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/timeline');
  });

  test('shows empty state when no goals', async ({ page }) => {
    await expect(page.getByText('No goals yet')).toBeVisible();
    await expect(page.getByText('Create your first financial goal')).toBeVisible();
  });

  test('has link to create goal', async ({ page }) => {
    const createLink = page.getByRole('link', { name: /Create a Goal/i });
    await expect(createLink).toBeVisible();
    await expect(createLink).toHaveAttribute('href', '/create');
  });
});

test.describe('Timeline - Responsive', () => {
  test.beforeEach(async ({ page }) => {
    const testGoals = createTestGoals();
    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, testGoals);
  });

  test('timeline is scrollable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/timeline');

    // Timeline should still be visible
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 Years' })).toBeVisible();
  });
});

test.describe('Timeline - Goal Clustering', () => {
  test('clusters goals with same target date', async ({ page }) => {
    const today = new Date();
    const sameDate = new Date(today);
    sameDate.setMonth(sameDate.getMonth() + 6);

    // Create two goals with the same target date
    const clusteredGoals = [
      {
        id: 'cluster-1',
        title: 'Goal A',
        description: 'First goal',
        amount: 5000,
        currency: 'USD',
        targetDate: sameDate.toISOString(),
        bucket: 'safety',
        whyItMatters: 'Testing',
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cluster-2',
        title: 'Goal B',
        description: 'Second goal',
        amount: 3000,
        currency: 'USD',
        targetDate: sameDate.toISOString(),
        bucket: 'growth',
        whyItMatters: 'Testing',
        priority: 1,
        createdAt: new Date().toISOString(),
      },
    ];

    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, clusteredGoals);

    await page.goto('/timeline');

    // Should show cluster indicator with count "2"
    await expect(page.getByRole('button', { name: '2 goals' })).toBeVisible();
  });
});
