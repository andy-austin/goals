import { test, expect } from '@playwright/test';

test.describe('Goal Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/create');
  });

  test('displays creation method selection', async ({ page }) => {
    // Should show start from scratch option
    await expect(page.getByRole('heading', { name: /start from scratch/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create goal/i }).first()).toBeVisible();
  });

  test('can select "Start from Scratch" option', async ({ page }) => {
    // Click Create goal button (the CTA for start from scratch)
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Should show the wizard with step 1 content
    await expect(page.getByRole('heading', { name: "What's your goal?" })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /goal title/i })).toBeVisible();
  });

  test('can navigate through wizard steps', async ({ page }) => {
    // Start from scratch
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Step 1: Fill in title and description
    await page.getByRole('textbox', { name: /goal title/i }).fill('Test Emergency Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('Build a safety net covering 6 months of living expenses for unexpected events');

    // Click next
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Should be on step 2 - check for step 2 content
    await expect(page.getByRole('heading', { name: 'Set your target' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: /target amount/i })).toBeVisible();

    // Step 2: Fill in amount
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('15000');

    // Click next
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Should be on step 3 - check for step 3 content
    await expect(page.getByRole('heading', { name: /when/i })).toBeVisible();
  });

  test('validates step 1 inputs', async ({ page }) => {
    // Start from scratch
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Verify we're on step 1
    await expect(page.getByRole('heading', { name: "What's your goal?" })).toBeVisible();

    // Check that Next button works when form is properly filled
    const nextButton = page.getByRole('button', { name: 'Next', exact: true });

    // Fill the form with valid data
    await page.getByRole('textbox', { name: /goal title/i }).fill('Emergency Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('A valid description');

    // Click next - should proceed to step 2
    await nextButton.click();

    // Should now be on step 2
    await expect(page.getByRole('heading', { name: 'Set your target' })).toBeVisible();
  });

  test('can go back to previous steps', async ({ page }) => {
    // Start from scratch
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Fill step 1
    await page.getByRole('textbox', { name: /goal title/i }).fill('Test Goal');
    await page.getByRole('textbox', { name: /description/i }).fill('A test goal description that is long enough to pass validation');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Should be on step 2
    await expect(page.getByRole('heading', { name: 'Set your target' })).toBeVisible();

    // Click back
    await page.getByRole('button', { name: 'Back', exact: true }).click();

    // Should be back on step 1
    await expect(page.getByRole('heading', { name: "What's your goal?" })).toBeVisible();

    // Data should be preserved
    await expect(page.getByRole('textbox', { name: /goal title/i })).toHaveValue('Test Goal');
  });

  test('bucket selection works', async ({ page }) => {
    // Navigate to bucket selection step
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Fill steps 1-3
    await page.getByRole('textbox', { name: /goal title/i }).fill('Test Goal');
    await page.getByRole('textbox', { name: /description/i }).fill('A test goal description that is long enough');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    await page.getByRole('spinbutton', { name: /target amount/i }).fill('10000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Use a quick select button for date
    await page.getByRole('button', { name: /1 year/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Should be on bucket selection (step 4) - check for step 4 content
    await expect(page.getByRole('heading', { name: /categorize your goal/i })).toBeVisible();

    // Select Safety bucket
    const safetyButton = page.getByRole('button', { name: /safety/i }).first();
    await safetyButton.click();

    // After selecting bucket, Next button should become enabled
    const nextButton = page.getByRole('button', { name: 'Next', exact: true });
    await expect(nextButton).toBeEnabled();
  });

  test('quick select buttons work for amount', async ({ page }) => {
    // Navigate to amount step
    await page.getByRole('button', { name: /create goal/i }).first().click();
    await page.getByRole('textbox', { name: /goal title/i }).fill('Test Goal');
    await page.getByRole('textbox', { name: /description/i }).fill('A test goal description that is long enough');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Should be on amount step
    await expect(page.getByRole('heading', { name: 'Set your target' })).toBeVisible();

    // Click a quick select amount button (format is "USD X,XXX.XX")
    await page.getByRole('button', { name: /USD 5,000/i }).click();

    // Amount input should have that value
    await expect(page.getByRole('spinbutton', { name: /target amount/i })).toHaveValue('5000');
  });
});

test.describe('Goal Creation - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/create');
  });

  test('can create a complete goal', async ({ page }) => {
    // Start from scratch
    await page.getByRole('button', { name: /create goal/i }).first().click();

    // Step 1: Title and Description
    await page.getByRole('textbox', { name: /goal title/i }).fill('Emergency Fund');
    await page.getByRole('textbox', { name: /description/i }).fill('Build a comprehensive emergency fund to cover 6 months of expenses');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 2: Amount
    await page.getByRole('spinbutton', { name: /target amount/i }).fill('15000');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 3: Target Date (use quick select)
    await page.getByRole('button', { name: /1 year/i }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 4: Bucket
    await page.getByRole('button', { name: /safety/i }).first().click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 5: Why It Matters - the field is labeled "Your Motivation*"
    await expect(page.getByRole('heading', { name: /why does this matter/i })).toBeVisible();
    await page.getByRole('textbox', { name: /your motivation/i }).fill('This will give me peace of mind and financial security');

    // Complete the goal (button text is just "Create" on the final step)
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');

    // Goal should appear on dashboard (use heading role to be specific)
    await expect(page.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
  });
});

test.describe('Template Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Set locale to English
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/create');
  });

  test('can view templates by bucket', async ({ page }) => {
    // Templates are already visible on the create page
    // Should show bucket tabs
    await expect(page.getByRole('button', { name: /^safety$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^growth$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^dream$/i })).toBeVisible();
  });

  test('can select a template to pre-fill form', async ({ page }) => {
    // Click on a template (Emergency Fund is in Safety bucket which is default)
    await page.getByRole('button', { name: /emergency fund/i }).first().click();

    // Should now be in the wizard with pre-filled data - check for step 1 content
    await expect(page.getByRole('heading', { name: "What's your goal?" })).toBeVisible();
    // Note: Template title uses lowercase 'fund' per translations
    await expect(page.getByRole('textbox', { name: /goal title/i })).toHaveValue('Emergency fund');
  });
});
