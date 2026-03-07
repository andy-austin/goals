import { test, expect } from '@playwright/test';

/**
 * End-to-end user journey tests that verify complete happy paths
 * across multiple pages, simulating real user workflows.
 */

const consentData = JSON.stringify({
  given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false
});

test.describe('Full User Journey: Landing → Create → Dashboard → Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.clear();
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
  });

  test('new user creates a goal from landing page CTA', async ({ page }) => {
    // 1. User lands on homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /stop saving/i })).toBeVisible();

    // 2. Clicks "Start Your First Goal"
    await page.getByRole('link', { name: /start your first goal/i }).click();
    await expect(page).toHaveURL('/create');

    // 3. Starts from scratch
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // 4. Step 1: Title & Description
    await page.getByRole('textbox', { name: /goal title/i }).fill('Emergency Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('Build a safety net covering 6 months of living expenses');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 5. Step 2: Amount
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('15000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 6. Step 3: Date (quick select)
    await page.getByRole('button', { name: /1 year/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 7. Step 4: Bucket
    await page.getByRole('button', { name: /safety/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 8. Step 5: Motivation
    await page.getByRole('textbox', { name: /your motivation/i }).fill('Peace of mind knowing I can handle emergencies');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // 9. Recommendation screen appears — go to dashboard
    await expect(page.getByText(/goal created/i)).toBeVisible();
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
  });

  test('user creates goal via calculator then views on timeline', async ({ page }) => {
    // 1. Start on landing page
    await page.goto('/');

    // 2. Use the calculator section
    await page.getByLabel('Target Amount').fill('30000');
    await page.getByLabel(/time horizon/i).fill('3');
    await page.waitForTimeout(200);

    // 3. Click "Create this Goal" which links to /create with params
    await page.getByRole('link', { name: /create this goal/i }).click();
    await expect(page).toHaveURL(/\/create/);

    // 4. The create page auto-enters wizard mode when URL params are present
    // Wait for step 1 heading
    await expect(page.getByRole('heading', { name: "What's your goal?" })).toBeVisible();

    // 5. Fill in title & description
    await page.getByRole('textbox', { name: /goal title/i }).fill('Dream House Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('Saving for down payment on our first family home');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 6. Amount should be pre-filled from URL params or we fill it
    const amountField = page.getByRole('spinbutton', { name: /target amount/i });
    const currentValue = await amountField.inputValue();
    if (!currentValue || currentValue === '0') {
      await amountField.fill('30000');
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 7. Date — the calculator may pre-fill, otherwise use quick select
    const dateField = page.getByLabel(/target date/i);
    const dateValue = await dateField.inputValue();
    if (!dateValue) {
      await page.getByRole('button', { name: /3 years/i }).click();
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 8. Select Growth bucket
    await page.getByRole('button', { name: /growth/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // 9. Motivation
    await page.getByRole('textbox', { name: /your motivation/i }).fill('To build equity and have a place to call our own');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // 10. Recommendation screen — go to dashboard
    await expect(page.getByText(/goal created/i)).toBeVisible();
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dream House Fund' })).toBeVisible();

    // 11. Navigate to timeline
    await page.getByRole('link', { name: /view timeline/i }).click();
    await expect(page).toHaveURL('/timeline');

    // 12. Goal appears on timeline
    await expect(page.getByText('Dream House Fund').first()).toBeVisible();
  });

  test('user creates multiple goals and views them grouped on dashboard', async ({ page }) => {
    await page.goto('/create');

    // Create first goal: Safety
    await page.getByRole('button', { name: /create goal/i }).first().click();
    await page.getByRole('textbox', { name: /goal title/i }).fill('Emergency Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('6 months of expenses saved for emergencies');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('10000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: /1 year/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: /safety/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('textbox', { name: /your motivation/i }).fill('Financial security for my family');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Recommendation screen — go to dashboard
    await expect(page.getByText(/goal created/i)).toBeVisible();
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');

    // Create second goal: Dream
    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page).toHaveURL('/create');
    await page.getByRole('button', { name: /create goal/i }).first().click();
    await page.getByRole('textbox', { name: /goal title/i }).fill('Japan Trip');
    await page.getByRole('textbox', { name: /description/i }).fill('Two week trip exploring Tokyo, Kyoto, and Osaka');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('8000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: /3 years/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: /dream/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('textbox', { name: /your motivation/i }).fill('Create lifelong memories with my partner');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Recommendation screen — go to dashboard
    await expect(page.getByText(/goal created/i)).toBeVisible();
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');

    // Both goals visible on dashboard
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Japan Trip' })).toBeVisible();

    // Dashboard shows correct total goals count
    await expect(page.getByText('2 goals')).toBeVisible();
  });

  test('user creates goal with template', async ({ page }) => {
    await page.goto('/create');

    // Select Emergency Fund template (Safety tab is default)
    await page.getByRole('button', { name: /emergency fund/i }).first().click();

    // Template pre-fills title
    await expect(page.getByRole('textbox', { name: /goal title/i })).toHaveValue('Emergency fund');

    // Fill description if not already filled
    const descField = page.getByRole('textbox', { name: /description/i });
    const descValue = await descField.inputValue();
    if (!descValue || descValue.length < 20) {
      await descField.fill('A financial safety net to cover unexpected expenses like medical bills or home repairs');
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 2: Amount
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('12000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 3: Date
    await page.getByRole('button', { name: /1 year/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 4: Bucket should be pre-selected to Safety from template
    // Either way, select Safety
    await page.getByRole('button', { name: /safety/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 5: Motivation may be pre-filled from template
    const whyField = page.getByRole('textbox', { name: /your motivation/i });
    const whyValue = await whyField.inputValue();
    if (!whyValue || whyValue.length < 10) {
      await whyField.fill('To provide peace of mind and prevent debt when life throws a curveball');
    }
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Recommendation screen — go to dashboard
    await expect(page.getByText(/goal created/i)).toBeVisible();
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /emergency fund/i })).toBeVisible();
  });
});

test.describe('Dashboard Actions', () => {
  const testGoals = [
    {
      id: 'journey-goal-1',
      title: 'Emergency Fund',
      description: 'Build a safety net for unexpected expenses',
      amount: 15000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Peace of mind',
      priority: 1,
      createdAt: new Date().toISOString(),
      visibility: 'private',
      spaceId: null,
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((goals) => {
      if (!localStorage.getItem('investment-goals-v1')) {
        localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals }));
      }
      if (!localStorage.getItem('fingoal_consent')) {
        localStorage.setItem('fingoal_consent', JSON.stringify({
          given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false
        }));
      }
    }, testGoals);
    await page.goto('/dashboard');
  });

  test('Add Goal button navigates to create page', async ({ page }) => {
    // Wait for goals to load (skeleton to disappear)
    await page.getByRole('heading', { name: /emergency fund/i }).waitFor();
    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page).toHaveURL('/create');
  });

  test('View Timeline button navigates to timeline', async ({ page }) => {
    // Wait for goals to load (skeleton to disappear)
    await page.getByRole('heading', { name: /emergency fund/i }).waitFor();
    await page.getByRole('button', { name: /view timeline/i }).click();
    await expect(page).toHaveURL('/timeline');
  });

  test('edit goal and see changes persisted', async ({ page }) => {
    // Open edit modal
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(page.getByRole('heading', { name: /edit goal/i })).toBeVisible();

    // Change the title
    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Emergency Fund');

    // Save
    await page.getByRole('button', { name: /save/i }).click();

    // Updated title visible
    await expect(page.getByRole('heading', { name: 'Updated Emergency Fund' })).toBeVisible();

    // Reload and verify persistence
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Updated Emergency Fund' })).toBeVisible();
  });

  test('delete goal shows empty state', async ({ page }) => {
    // Click delete
    await page.getByRole('button', { name: /delete/i }).first().click();

    // Confirm deletion
    await expect(page.getByRole('heading', { name: /delete goal/i })).toBeVisible();
    await page.getByRole('button', { name: /delete/i }).last().click();

    // Should show empty state
    await expect(page.getByRole('heading', { name: /no goals yet/i })).toBeVisible();
  });
});

test.describe('Cross-Page Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript((consent) => {
      localStorage.setItem('fingoal_consent', consent);
    }, consentData);
  });

  test('landing → login → signup → login round trip', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /stop saving/i })).toBeVisible();

    // Navigate to create via header
    await page.getByRole('link', { name: /get started/i }).click();
    await expect(page).toHaveURL('/create');

    // Go to login page
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    // Navigate to signup
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

    // Navigate back to login using the "Sign In" link in the form area
    await page.getByRole('main').getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/auth/login');
  });

  test('dashboard empty state leads to create page', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('fingoal_consent', JSON.stringify({
        given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false
      }));
    });
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: /no goals yet/i })).toBeVisible();
    // Use a template card in the empty state (links to /create with template param)
    await page.getByRole('main').getByRole('link', { name: /create goal/i }).first().click();
    await expect(page).toHaveURL(/\/create/);
  });

  test('timeline empty state leads to create page', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('fingoal_consent', JSON.stringify({
        given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false
      }));
    });
    await page.goto('/timeline');

    await expect(page.getByRole('heading', { name: /no goals yet/i })).toBeVisible();
    // Use a template card in the empty state (links to /create with template param)
    await page.getByRole('main').getByRole('link', { name: /create goal/i }).first().click();
    await expect(page).toHaveURL(/\/create/);
  });
});
