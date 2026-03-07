/**
 * Authenticated E2E tests for the live Vercel deployment.
 *
 * These tests use real Supabase auth (session stored by tests/setup/auth.setup.ts)
 * and verify full authenticated flows: goal CRUD, spaces navigation, and header UX.
 *
 * Run with:
 *   npx playwright test --config=playwright.production.config.ts
 *
 * Design notes:
 * - Tests that create goals clean up (delete) at the end to keep the DB tidy.
 * - Unique titles (using Date.now()) prevent inter-test conflicts.
 * - Sign-out is intentionally omitted here to avoid breaking the shared context;
 *   it can be tested in isolation if needed.
 */
import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Drive the 5-step wizard to completion. Assumes the user is already on a
 * page with English locale active (handled by auth storageState).
 */
async function createGoalViaWizard(
  page: Page,
  opts: {
    title: string;
    description: string;
    amount: string;
    bucket: 'safety' | 'growth' | 'dream';
    motivation: string;
  }
) {
  await page.goto('/create');
  await page.waitForLoadState('networkidle');

  // Dismiss consent banner if it appears (shouldn't with saved storageState, but guard anyway)
  const acceptBtn = page.getByRole('button', { name: /accept all/i });
  if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptBtn.click();
    await acceptBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  // Enter wizard and wait for step 1 text input to appear.
  // Using a locale-agnostic selector so this works regardless of locale.
  await page.getByRole('button', { name: /create goal/i }).first().click();
  await page.locator('input[type="text"]').first().waitFor({ timeout: 20000 });

  // Step 1 – Details
  await page.getByRole('textbox', { name: /goal title/i }).fill(opts.title);
  await page.getByRole('textbox', { name: /description/i }).fill(opts.description);
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 2 – Amount
  await page.getByRole('spinbutton', { name: /target amount/i }).fill(opts.amount);
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 3 – Date (quick-select)
  await page.getByRole('button', { name: /1 year/i }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 4 – Category
  await page.getByRole('button', { name: new RegExp(opts.bucket, 'i') }).first().click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 5 – Motivation
  await page.getByRole('textbox', { name: /your motivation/i }).fill(opts.motivation);
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

/**
 * Delete a goal by its title. Best-effort: silently ignores errors so it can
 * be used safely in afterEach / afterAll hooks.
 */
async function deleteGoalByTitle(page: Page, title: string) {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  const goalCard = page.locator('div').filter({
    has: page.getByRole('heading', { name: title }),
  }).first();

  if (!(await goalCard.isVisible({ timeout: 3000 }).catch(() => false))) return;

  await goalCard.getByRole('button', { name: /delete/i }).click();
  // Confirm in the modal
  await page.getByRole('button', { name: /delete/i }).last().click();
}

// ---------------------------------------------------------------------------
// Dashboard – authenticated empty state
// ---------------------------------------------------------------------------

test.describe('Authenticated Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('shows Dashboard heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('no Sign In link visible when logged in', async ({ page }) => {
    // The Sign In link is only shown to unauthenticated users
    await expect(page.getByRole('link', { name: /sign in/i })).not.toBeVisible();
  });

  test('user menu button shows display name', async ({ page }) => {
    // The avatar/name button opens the dropdown
    await expect(page.getByRole('button', { name: /test/i })).toBeVisible();
  });

  test('user dropdown shows email and Sign Out', async ({ page }) => {
    await page.getByRole('button', { name: /test/i }).click();
    await expect(page.getByText('test@goals.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });

  test('Timeline and Spaces links are visible in the top nav', async ({ page }) => {
    await expect(page.locator('nav').getByRole('link', { name: /timeline/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: /spaces/i })).toBeVisible();
  });

  test('Timeline link in top nav navigates to /timeline', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: /timeline/i }).first().click();
    await expect(page).toHaveURL(/\/timeline/);
  });

  test('Spaces link in top nav navigates to /spaces', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: /spaces/i }).first().click();
    await expect(page).toHaveURL(/\/spaces/);
  });
});

// ---------------------------------------------------------------------------
// Goal creation – Supabase-backed
// ---------------------------------------------------------------------------

test.describe('Authenticated Goal Creation', () => {
  // Use a unique title per test run to avoid collisions
  let testTitle: string;

  test.beforeEach(async () => {
    testTitle = `E2E Auth Goal ${Date.now()}`;
  });

  test.afterEach(async ({ page }) => {
    await deleteGoalByTitle(page, testTitle).catch(() => {});
  });

  test('wizard completes and goal appears on dashboard', async ({ page }) => {
    await createGoalViaWizard(page, {
      title: testTitle,
      description: 'Automated test goal saved to Supabase via the full wizard',
      amount: '5000',
      bucket: 'safety',
      motivation: 'Verifying Supabase-backed goal creation in production E2E',
    });

    await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();
  });

  test('Add goal and View timeline buttons appear in dashboard header after creation', async ({ page }) => {
    await createGoalViaWizard(page, {
      title: testTitle,
      description: 'Checking dashboard action buttons after first goal is created',
      amount: '8000',
      bucket: 'growth',
      motivation: 'Testing action button visibility',
    });

    await expect(page.getByRole('button', { name: /add goal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /view timeline/i })).toBeVisible();
  });

  test('created goal is visible on the timeline', async ({ page }) => {
    await createGoalViaWizard(page, {
      title: testTitle,
      description: 'Goal created to verify Gantt chart display for authenticated users',
      amount: '12000',
      bucket: 'dream',
      motivation: 'See my goal on the timeline',
    });

    // Use the "View timeline" button from the dashboard header (visible after goal exists)
    await page.getByRole('button', { name: /view timeline/i }).click();
    await expect(page).toHaveURL(/\/timeline/);
    await expect(page.getByText(testTitle).first()).toBeVisible({ timeout: 10000 });
  });

  test('selecting Emergency Fund template pre-fills title', async ({ page }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /emergency fund/i }).first().click();
    await expect(page.getByRole('textbox', { name: /goal title/i })).toHaveValue(
      /emergency fund/i
    );
  });

  test('bucket tabs filter templates on create page', async ({ page }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /^growth$/i }).click();
    await expect(page.getByRole('button', { name: /^safety$/i })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Goal editing – Supabase-backed
// ---------------------------------------------------------------------------

test.describe('Authenticated Goal Edit', () => {
  let baseTitle: string;
  let updatedTitle: string;

  test.beforeEach(async ({ page }) => {
    baseTitle = `E2E Edit Goal ${Date.now()}`;
    updatedTitle = `${baseTitle} UPDATED`;

    await createGoalViaWizard(page, {
      title: baseTitle,
      description: 'Goal created to test editing for the authenticated test user',
      amount: '20000',
      bucket: 'growth',
      motivation: 'Testing edit persistence in Supabase',
    });
  });

  test.afterEach(async ({ page }) => {
    await deleteGoalByTitle(page, updatedTitle).catch(() => {});
    await deleteGoalByTitle(page, baseTitle).catch(() => {});
  });

  test('editing the title reflects the change on the dashboard', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: baseTitle }),
    }).first();

    await goalCard.getByRole('button', { name: /edit/i }).click();
    // exact: true prevents matching the goal card heading "E2E Edit Goal …"
    await expect(page.getByRole('heading', { name: 'Edit Goal', exact: true })).toBeVisible();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill(updatedTitle);
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  });

  test('edit modal is pre-populated with current goal data', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: baseTitle }),
    }).first();

    await goalCard.getByRole('button', { name: /edit/i }).click();
    await expect(page.getByLabel(/goal title/i)).toHaveValue(baseTitle);
    await expect(page.getByLabel(/target amount/i)).toHaveValue('20000');
  });

  test('cancelling the edit modal discards changes', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: baseTitle }),
    }).first();

    await goalCard.getByRole('button', { name: /edit/i }).click();
    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('This Should Not Be Saved');
    await page.getByText('Cancel', { exact: true }).click();

    await expect(page.getByRole('heading', { name: baseTitle })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'This Should Not Be Saved' })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Goal deletion – Supabase-backed
// ---------------------------------------------------------------------------

test.describe('Authenticated Goal Delete', () => {
  let testTitle: string;

  test.beforeEach(async ({ page }) => {
    testTitle = `E2E Delete Goal ${Date.now()}`;
    await createGoalViaWizard(page, {
      title: testTitle,
      description: 'Goal created to test deletion for the authenticated test user',
      amount: '3000',
      bucket: 'safety',
      motivation: 'Testing Supabase delete',
    });
  });

  test('deleting a goal removes it from the dashboard', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: testTitle }),
    }).first();

    await goalCard.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByRole('heading', { name: 'Delete Goal?' })).toBeVisible();
    await page.getByRole('button', { name: /delete/i }).last().click();

    await expect(page.getByRole('heading', { name: testTitle })).not.toBeVisible();
  });

  test('cancelling the delete dialog leaves the goal intact', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: testTitle }),
    }).first();

    await goalCard.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();

    // Clean up
    await deleteGoalByTitle(page, testTitle).catch(() => {});
  });
});

// ---------------------------------------------------------------------------
// Spaces – authenticated
// ---------------------------------------------------------------------------

test.describe('Authenticated Spaces List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spaces');
    await page.waitForLoadState('networkidle');
  });

  test('renders the Shared Spaces heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /shared spaces/i })).toBeVisible();
  });

  test('shows the existing "My Space" space', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Space' })).toBeVisible();
  });

  test('shows "New space" button for authenticated users', async ({ page }) => {
    await expect(page.getByRole('button', { name: /new space/i })).toBeVisible();
  });

  test('does NOT show sign-in-required message for authenticated users', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /sign in to use shared spaces/i })
    ).not.toBeVisible();
  });

  test('clicking My Space navigates to its detail page', async ({ page }) => {
    await page.getByRole('link').filter({
      has: page.getByRole('heading', { name: 'My Space' }),
    }).click();

    await expect(page).toHaveURL(/\/spaces\/.+/);
    await expect(page.getByRole('heading', { name: 'My Space' })).toBeVisible();
  });
});

test.describe('Authenticated Space Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spaces');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link').filter({
      has: page.getByRole('heading', { name: 'My Space' }),
    }).click();
    await page.waitForLoadState('networkidle');
  });

  test('shows space name and Owner badge', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Space' })).toBeVisible();
    await expect(page.getByText(/owner/i).first()).toBeVisible();
  });

  test('has an Invite button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /invite/i })).toBeVisible();
  });

  test('has a Delete space button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /delete space/i })).toBeVisible();
  });

  test('shows Members section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /members/i })).toBeVisible();
  });

  test('shows Shared Goals section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /shared goals/i })).toBeVisible();
  });

  test('back link returns to spaces list', async ({ page }) => {
    await page.getByRole('link', { name: /all spaces/i }).click();
    await expect(page).toHaveURL(/\/spaces$/);
  });
});

// ---------------------------------------------------------------------------
// Share goal flow
// ---------------------------------------------------------------------------

test.describe('Share Goal to Space', () => {
  let testTitle: string;

  test.beforeEach(async ({ page }) => {
    testTitle = `E2E Share Goal ${Date.now()}`;
    await createGoalViaWizard(page, {
      title: testTitle,
      description: 'Goal created to test the sharing flow to My Space',
      amount: '7500',
      bucket: 'dream',
      motivation: 'Testing goal visibility sharing to a space',
    });
  });

  test.afterEach(async ({ page }) => {
    await deleteGoalByTitle(page, testTitle).catch(() => {});
  });

  test('goal card has a Share button', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: testTitle }),
    }).first();
    await expect(goalCard.getByRole('button', { name: /share/i })).toBeVisible();
  });

  test('clicking Share opens the share modal', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: testTitle }),
    }).first();
    await goalCard.getByRole('button', { name: /share/i }).click();
    // Use exact: true to avoid matching the goal card heading that contains the word "Share"
    await expect(page.getByRole('heading', { name: 'Share Goal', exact: true })).toBeVisible();
  });

  test('share modal does NOT show auth-gate for authenticated users', async ({ page }) => {
    const goalCard = page.locator('div').filter({
      has: page.getByRole('heading', { name: testTitle }),
    }).first();
    await goalCard.getByRole('button', { name: /share/i }).click();
    await expect(page.getByText(/sign in to use shared spaces/i)).not.toBeVisible();
  });
});
