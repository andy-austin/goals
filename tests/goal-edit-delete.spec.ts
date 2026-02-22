import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const testGoal = {
  id: 'goal_edit_1',
  title: 'Emergency Fund',
  description: 'Build a 6-month emergency fund for unexpected expenses',
  amount: 15000,
  currency: 'USD',
  targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  bucket: 'safety',
  whyItMatters: 'Peace of mind for my family',
  priority: 1,
  createdAt: new Date().toISOString(),
  visibility: 'private',
  spaceId: null,
};

const secondGoal = {
  id: 'goal_edit_2',
  title: 'House Down Payment',
  description: 'Save for a down payment on our first home',
  amount: 50000,
  currency: 'USD',
  targetDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
  bucket: 'growth',
  whyItMatters: 'Provide stability for my family',
  priority: 1,
  createdAt: new Date().toISOString(),
  visibility: 'private',
  spaceId: null,
};

function seedStorage(goals: object[]) {
  return (page: import('@playwright/test').Page) =>
    page.addInitScript((g) => {
      localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals: g }));
    }, goals);
}

// ---------------------------------------------------------------------------
// Delete goal flow
// ---------------------------------------------------------------------------

test.describe('Delete goal', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
  });

  test('shows a confirmation dialog before deleting', async ({ page }) => {
    await page.getByRole('button', { name: /delete/i }).first().click();

    await expect(page.getByRole('heading', { name: 'Delete Goal?' })).toBeVisible();
    await expect(page.getByText(/this action cannot be undone/i)).toBeVisible();
  });

  test('cancelling the dialog leaves the goal intact', async ({ page }) => {
    await page.getByRole('button', { name: /delete/i }).first().click();
    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
  });

  test('confirming deletion removes the goal card', async ({ page }) => {
    await page.getByRole('button', { name: /delete/i }).first().click();

    // The confirmation modal has a destructive "Delete" button
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    await confirmBtn.click();

    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();
  });

  test('shows a success toast after deletion', async ({ page }) => {
    await page.getByRole('button', { name: /delete/i }).first().click();
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    await confirmBtn.click();

    // Toast message contains the word "Delete" (from "Delete Emergency Fund")
    await expect(page.getByText(/Delete Emergency Fund/i)).toBeVisible();
  });

  test('deleting one goal leaves others unaffected', async ({ page }) => {
    // Seed two goals
    await page.addInitScript((goals) => {
      localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals }));
    }, [testGoal, secondGoal]);
    await page.goto('/dashboard');

    // Delete only the Safety goal
    await page.getByRole('button', { name: /delete/i }).first().click();
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    await confirmBtn.click();

    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'House Down Payment' })).toBeVisible();
  });

  test('dashboard shows empty state after the last goal is deleted', async ({ page }) => {
    await page.getByRole('button', { name: /delete/i }).first().click();
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    await confirmBtn.click();

    await expect(page.getByRole('heading', { name: 'No goals yet' })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Edit goal flow
// ---------------------------------------------------------------------------

test.describe('Edit goal', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
  });

  test('clicking Edit opens the Edit Goal modal', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    await expect(page.getByRole('heading', { name: 'Edit Goal' })).toBeVisible();
  });

  test('edit modal is pre-populated with the goal\'s current data', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    await expect(page.getByLabel(/goal title/i)).toHaveValue('Emergency Fund');
    await expect(page.getByLabel(/description/i).first()).toHaveValue(
      'Build a 6-month emergency fund for unexpected expenses'
    );
    await expect(page.getByLabel(/target amount/i)).toHaveValue('15000');
    await expect(page.getByLabel(/your motivation/i)).toHaveValue('Peace of mind for my family');
  });

  test('closing the modal with Cancel discards changes', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Changed Title');

    await page.getByRole('button', { name: /cancel/i }).click();

    // Original title should still be shown
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Changed Title' })).not.toBeVisible();
  });

  test('closing the modal with the X button discards changes', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Will Be Discarded');

    // Click the close (×) button in the modal header
    await page.getByRole('dialog').getByRole('button', { name: /close/i }).click();

    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
  });

  test('saving updated title reflects on the dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Emergency Fund');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('heading', { name: 'Updated Emergency Fund' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).not.toBeVisible();
  });

  test('shows a success toast after saving edits', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Emergency Fund');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(/goal updated successfully/i)).toBeVisible();
  });

  test('Save button is disabled when title is cleared (validation)', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();

    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  test('edited goal data persists after page reload', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).first().click();

    const titleInput = page.getByLabel(/goal title/i);
    await titleInput.clear();
    await titleInput.fill('Persisted Title');
    await page.getByRole('button', { name: /save/i }).click();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Persisted Title' })).toBeVisible();
  });
});
