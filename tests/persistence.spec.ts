import { test, expect } from '@playwright/test';

test.describe('LocalStorage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
  });

  test('goals persist after page refresh', async ({ page }) => {
    // Use addInitScript to set localStorage before the page loads
    const testGoal = {
      id: 'goal_persist_1',
      title: 'Persistence Test Goal',
      description: 'This goal should persist after refresh',
      amount: 10000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'Testing persistence',
      priority: 1,
      createdAt: new Date().toISOString(),
    };

    await page.addInitScript((goal) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals: [goal] })
      );
    }, testGoal);

    // Navigate to the page - app should load the goal
    await page.goto('/');

    // Goal should be visible (use heading role to be specific)
    await expect(page.getByRole('heading', { name: 'Persistence Test Goal' })).toBeVisible();

    // Reload the page
    await page.reload();

    // Goal should still be visible after refresh
    await expect(page.getByRole('heading', { name: 'Persistence Test Goal' })).toBeVisible();
  });

  test('localStorage contains correct data structure', async ({ page }) => {
    const testGoal = {
      id: 'goal_structure_1',
      title: 'Structure Test',
      description: 'Testing localStorage structure',
      amount: 5000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'growth',
      whyItMatters: 'Testing',
      priority: 1,
      createdAt: new Date().toISOString(),
    };

    await page.addInitScript((goal) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals: [goal] })
      );
    }, testGoal);

    // Navigate to the page
    await page.goto('/');

    // Wait for the goal to be visible (confirms hydration is complete)
    await expect(page.getByRole('heading', { name: 'Structure Test' })).toBeVisible();

    // Verify the storage structure after app has processed it
    const storageData = await page.evaluate(() => {
      const data = localStorage.getItem('investment-goals-v1');
      return data ? JSON.parse(data) : null;
    });

    expect(storageData).not.toBeNull();
    expect(storageData.version).toBe(1);
    expect(storageData.goals).toHaveLength(1);
    expect(storageData.goals[0].title).toBe('Structure Test');
    expect(storageData.goals[0].bucket).toBe('growth');
  });

  test('empty localStorage shows empty state', async ({ page }) => {
    // Clear any existing localStorage
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');

    // Should show empty state
    await expect(page.getByRole('heading', { name: 'No goals yet' })).toBeVisible();
  });

  test('multiple goals persist after page refresh', async ({ page }) => {
    // Test that multiple goals with different priorities persist
    const testGoals = [
      {
        id: 'goal_multi_1',
        title: 'First Goal',
        description: 'First goal',
        amount: 1000,
        currency: 'USD',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        bucket: 'safety',
        whyItMatters: 'First',
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'goal_multi_2',
        title: 'Second Goal',
        description: 'Second goal',
        amount: 2000,
        currency: 'USD',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        bucket: 'safety',
        whyItMatters: 'Second',
        priority: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'goal_multi_3',
        title: 'Third Goal',
        description: 'Third goal in growth bucket',
        amount: 3000,
        currency: 'USD',
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        bucket: 'growth',
        whyItMatters: 'Third',
        priority: 1,
        createdAt: new Date().toISOString(),
      },
    ];

    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, testGoals);

    // Navigate to the page
    await page.goto('/');

    // Wait for goals to be visible (confirms hydration) - use heading role
    await expect(page.getByRole('heading', { name: 'First Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Second Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Third Goal' })).toBeVisible();

    // Reload the page
    await page.reload();

    // Goals should still be visible after reload
    await expect(page.getByRole('heading', { name: 'First Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Second Goal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Third Goal' })).toBeVisible();

    // Verify all goals persisted in localStorage
    const storageData = await page.evaluate(() => {
      const data = localStorage.getItem('investment-goals-v1');
      return data ? JSON.parse(data) : null;
    });

    expect(storageData).not.toBeNull();
    expect(storageData.goals).toHaveLength(3);

    // Check each goal exists with correct bucket
    const safetyGoals = storageData.goals.filter((g: { bucket: string }) => g.bucket === 'safety');
    const growthGoals = storageData.goals.filter((g: { bucket: string }) => g.bucket === 'growth');

    expect(safetyGoals).toHaveLength(2);
    expect(growthGoals).toHaveLength(1);
  });

  test('handles corrupted localStorage gracefully', async ({ page }) => {
    // Set corrupted data before navigating
    await page.addInitScript(() => {
      localStorage.setItem('investment-goals-v1', 'invalid json {{{');
    });

    // Navigate - should not crash
    await page.goto('/');

    // Should show empty state (corrupted data should be ignored)
    await expect(page.getByText('No goals yet')).toBeVisible();
  });

  test('handles partial goal data gracefully', async ({ page }) => {
    const partialGoals = [
      {
        id: 'valid_goal',
        title: 'Valid Goal',
        description: 'This is a valid goal',
        amount: 5000,
        currency: 'USD',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        bucket: 'safety',
        whyItMatters: 'Valid',
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        // Missing most required fields
        id: 'invalid_goal',
        title: 'Invalid Goal',
      },
    ];

    await page.addInitScript((goals) => {
      localStorage.setItem(
        'investment-goals-v1',
        JSON.stringify({ version: 1, goals })
      );
    }, partialGoals);

    await page.goto('/');

    // Valid goal should be displayed (use heading role)
    await expect(page.getByRole('heading', { name: 'Valid Goal' })).toBeVisible();
  });
});
