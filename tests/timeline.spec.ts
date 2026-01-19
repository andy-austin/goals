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
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
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
    await expect(page.getByText(/Visualize your goals and milestones over time/)).toBeVisible();
  });

  test('shows zoom controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: '1 Year' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 Years' })).toBeVisible();
    await expect(page.getByRole('button', { name: '10+ Years' })).toBeVisible();
  });

  test('displays goals count', async ({ page }) => {
    await expect(page.getByText('3 goals')).toBeVisible();
  });

  test('shows today marker', async ({ page }) => {
    await expect(page.getByText('Today').first()).toBeVisible();
  });

  test('shows bucket legend', async ({ page }) => {
    // Legend items are in the footer area with specific styling
    const legend = page.locator('.flex.flex-wrap.items-center.gap-4.text-xs');
    await expect(legend.getByText('Safety')).toBeVisible();
    await expect(legend.getByText('Growth')).toBeVisible();
    await expect(legend.getByText('Dream')).toBeVisible();
  });

  test('zoom controls change active state', async ({ page }) => {
    // Default should be All
    const allBtn = page.getByRole('button', { name: 'All' });
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');

    // Click 1 Year
    const oneYearBtn = page.getByRole('button', { name: '1 Year' });
    await oneYearBtn.click();
    await expect(oneYearBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(allBtn).toHaveAttribute('aria-pressed', 'false');

    // Click 10+ Years
    const tenYearsBtn = page.getByRole('button', { name: '10+ Years' });
    await tenYearsBtn.click();
    await expect(tenYearsBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(oneYearBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('displays goal markers with titles', async ({ page }) => {
    // Goals should be visible as markers in the timeline (using the specific aria-label)
    await expect(page.getByRole('button', { name: 'Goal: Emergency Fund' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Goal: House Down Payment' })).toBeVisible();
  });

  test('clicking goal marker opens detail modal', async ({ page }) => {
    // Click on Emergency Fund goal (use specific aria-label from timeline marker)
    await page.getByRole('button', { name: 'Goal: Emergency Fund' }).click();

    // Modal should appear with goal details
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    // Use a more specific selector for the modal content (currency format is "USD X,XXX.XX")
    const modal = page.locator('.fixed.inset-0');
    await expect(modal.getByText(/USD 15,000/)).toBeVisible();
    await expect(modal.getByText('Peace of mind and financial security')).toBeVisible();
  });

  test('modal can be closed', async ({ page }) => {
    // Open modal (use specific aria-label from timeline marker)
    await page.getByRole('button', { name: 'Goal: Emergency Fund' }).click();
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();

    // Close via X button
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();
  });

  test('hovering goal shows tooltip', async ({ page }) => {
    // Hover over a goal marker (use specific aria-label from timeline marker)
    const goalMarker = page.getByRole('button', { name: 'Goal: Emergency Fund' });
    await goalMarker.hover();

    // Tooltip should appear
    await expect(page.getByRole('tooltip')).toBeVisible();
  });
});

test.describe('Timeline - Empty State', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    // Clear localStorage
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/timeline');
  });

  test('shows empty state when no goals', async ({ page }) => {
    await expect(page.getByText('No goals yet')).toBeVisible();
    await expect(page.getByText(/Create your first financial goal/)).toBeVisible();
  });

  test('has link to create goal', async ({ page }) => {
    // Use exact match to avoid matching nav link
    const createLink = page.getByRole('link', { name: 'Create Goal', exact: true });
    await expect(createLink).toBeVisible();
    await expect(createLink).toHaveAttribute('href', '/create');
  });
});

test.describe('Timeline - Responsive', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
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
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  });
});

test.describe('Timeline - Goal Clustering', () => {
  test('clusters goals with same target date', async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
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

test.describe('Timeline - Gantt Chart', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    const testGoals = createTestGoals();
    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, testGoals);
    await page.goto('/timeline');
  });

  test('displays Gantt View section', async ({ page }) => {
    // The Gantt chart section has a "Goal" label at the top
    await expect(page.getByText('Goal').first()).toBeVisible();
    // And shows goal buttons with amounts (use first() since there are multiple matching buttons)
    await expect(page.getByRole('button', { name: /Emergency Fund.*USD/ }).first()).toBeVisible();
  });

  test('shows all goals as rows in Gantt chart', async ({ page }) => {
    // Each goal should appear in the Gantt chart
    const ganttSection = page.locator('text=Gantt View').locator('..').locator('..');

    // Check for goal titles in Gantt rows
    await expect(page.getByText('Emergency Fund').first()).toBeVisible();
    await expect(page.getByText('House Down Payment').first()).toBeVisible();
    await expect(page.getByText('Dream Vacation').first()).toBeVisible();
  });

  test('Gantt rows show goal amounts', async ({ page }) => {
    // Goals should show their amounts in the Gantt rows (format is "USD X,XXX.XX")
    await expect(page.getByText(/USD 15,000/).first()).toBeVisible();
    await expect(page.getByText(/USD 60,000/).first()).toBeVisible();
    await expect(page.getByText(/USD 10,000/).first()).toBeVisible();
  });

  test('clicking Gantt row opens goal modal', async ({ page }) => {
    // Find the Emergency Fund button in the Gantt chart label area and click it
    // Button name includes goal title and amount in "USD X,XXX.XX" format
    const ganttButton = page.getByRole('button', { name: /Emergency Fund.*USD 15,000/ });
    await ganttButton.first().click();

    // Modal should appear with goal details
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    await expect(page.getByText('Peace of mind and financial security')).toBeVisible();
  });
});
