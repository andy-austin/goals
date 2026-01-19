import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Goal Reordering', () => {
  const testGoals = [
    {
      id: 'goal_safety_1',
      title: 'First Safety Goal',
      description: 'This is the first safety goal',
      amount: 5000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Important for safety',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_safety_2',
      title: 'Second Safety Goal',
      description: 'This is the second safety goal',
      amount: 10000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Also important',
      priority: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_safety_3',
      title: 'Third Safety Goal',
      description: 'This is the third safety goal',
      amount: 15000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Third priority',
      priority: 3,
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
    await page.goto('/dashboard');
  });

  test('displays drag handles on goal cards', async ({ page }) => {
    // Each goal card should have a drag handle button
    const dragHandles = page.getByRole('button', { name: /drag to reorder/i });
    await expect(dragHandles).toHaveCount(3);
  });

  test('goals display priority numbers correctly', async ({ page }) => {
    // Goals should be visible (use heading role to be specific)
    await expect(page.getByRole('heading', { name: 'First Safety Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Second Safety Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Third Safety Goal' })).toBeVisible();

    // Priority badges should be present
    await expect(page.getByText('#1').first()).toBeVisible();
    await expect(page.getByText('#2').first()).toBeVisible();
    await expect(page.getByText('#3').first()).toBeVisible();
  });

  test('drag handle is keyboard accessible', async ({ page }) => {
    // Focus on the first drag handle
    const firstDragHandle = page.getByRole('button', { name: /drag to reorder/i }).first();
    await firstDragHandle.focus();

    // Should be focusable
    await expect(firstDragHandle).toBeFocused();
  });

  test('goals can be reordered via drag and drop', async ({ page }) => {
    // Wait for goals to be fully rendered
    await expect(page.getByRole('heading', { name: 'First Safety Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Second Safety Goal' })).toBeVisible();

    // Get the drag handle for the first goal
    const firstDragHandle = page.getByRole('button', { name: /drag to reorder/i }).first();
    await expect(firstDragHandle).toBeVisible();

    const handleBox = await firstDragHandle.boundingBox();
    if (!handleBox) {
      throw new Error('Could not get drag handle bounding box');
    }

    // Get the second goal's position for drop target
    const secondGoal = page.getByRole('heading', { name: 'Second Safety Goal' });
    const secondBox = await secondGoal.boundingBox();
    if (!secondBox) {
      throw new Error('Could not get second goal bounding box');
    }

    // Perform drag and drop
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height + 10);
    await page.mouse.up();

    // Wait for reorder animation to complete
    await page.waitForTimeout(500);

    // Verify all goals are still present after reorder
    await expect(page.getByRole('heading', { name: 'First Safety Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Second Safety Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Third Safety Goal' })).toBeVisible();
  });
});
