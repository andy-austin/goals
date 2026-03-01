import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const futureDate = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();

const testGoal = {
  id: 'goal_track_1',
  title: 'House Down Payment',
  description: 'Save for a down payment on our first home in the suburbs',
  amount: 50000,
  currency: 'USD',
  targetDate: futureDate,
  bucket: 'growth',
  whyItMatters: 'Provide stability and a home for my family',
  priority: 1,
  createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
  visibility: 'private',
  spaceId: null,
  checkIns: [],
};

const goalWithCheckIn = {
  ...testGoal,
  id: 'goal_track_2',
  checkIns: [
    {
      id: 'ci_existing_1',
      date: '2026-01-15',
      currentAmount: 12500,
      note: 'First quarter contribution',
      createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
    },
  ],
};

function seedStorage(goals: object[]) {
  return (page: import('@playwright/test').Page) =>
    page.addInitScript((g) => {
      if (!localStorage.getItem('investment-goals-v1')) {
        localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals: g }));
      }
      if (!localStorage.getItem('fingoal_consent')) {
        localStorage.setItem(
          'fingoal_consent',
          JSON.stringify({ given: true, timestamp: '2025-01-01T00:00:00.000Z', policyVersion: '1.0.0', analyticsConsent: false })
        );
      }
    }, goals);
}

// ---------------------------------------------------------------------------
// TrackingModal — open / close
// ---------------------------------------------------------------------------

test.describe('Tracking modal – open and close', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
  });

  test('Track Progress button is visible on each goal card', async ({ page }) => {
    await expect(page.getByRole('button', { name: /track progress/i }).first()).toBeVisible();
  });

  test('clicking Track Progress opens the TrackingModal', async ({ page }) => {
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /track progress/i })).toBeVisible();
  });

  test('modal shows the goal title as subtitle', async ({ page }) => {
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByRole('dialog').getByText('House Down Payment')).toBeVisible();
  });

  test('pressing Escape closes the modal', async ({ page }) => {
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('clicking X button closes the modal', async ({ page }) => {
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: /close/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('clicking the backdrop closes the modal', async ({ page }) => {
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Click the backdrop (the fixed overlay outside the modal card)
    await page.mouse.click(10, 10);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// TrackingModal — investment vehicle section
// ---------------------------------------------------------------------------

test.describe('Tracking modal – investment vehicle', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
  });

  test('shows the Investment Vehicle section', async ({ page }) => {
    await expect(page.getByText(/investment vehicle/i)).toBeVisible();
  });

  test('vehicle name field accepts input', async ({ page }) => {
    await page.getByLabel(/vehicle name/i).fill('Vanguard S&P 500 Index Fund');
    await expect(page.getByLabel(/vehicle name/i)).toHaveValue('Vanguard S&P 500 Index Fund');
  });

  test('institution field accepts input', async ({ page }) => {
    await page.getByLabel(/institution/i).fill('Vanguard');
    await expect(page.getByLabel(/institution/i)).toHaveValue('Vanguard');
  });

  test('vehicle type field accepts input', async ({ page }) => {
    await page.getByLabel(/type/i).first().fill('Index Fund');
    await expect(page.getByLabel(/type/i).first()).toHaveValue('Index Fund');
  });

  test('saving vehicle info closes modal and shows toast', async ({ page }) => {
    await page.getByLabel(/vehicle name/i).fill('Vanguard S&P 500');
    await page.getByRole('button', { name: /^save$/i }).click();

    // Modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible();
    // Toast appears
    await expect(page.getByText(/tracking info updated/i)).toBeVisible();
  });

  test('saved vehicle info is shown on reopening the modal', async ({ page }) => {
    await page.getByLabel(/vehicle name/i).fill('Vanguard S&P 500');
    await page.getByRole('button', { name: /^save$/i }).click();

    // Reopen
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByLabel(/vehicle name/i)).toHaveValue('Vanguard S&P 500');
  });
});

// ---------------------------------------------------------------------------
// TrackingModal — cadence selector
// ---------------------------------------------------------------------------

test.describe('Tracking modal – cadence', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
  });

  test('shows the Review cadence section', async ({ page }) => {
    await expect(page.getByText(/review cadence/i)).toBeVisible();
  });

  test('cadence selector defaults to no scheduled review', async ({ page }) => {
    const select = page.getByLabel(/how often/i);
    await expect(select).toHaveValue('');
  });

  test('cadence can be set to monthly', async ({ page }) => {
    await page.getByLabel(/how often/i).selectOption('monthly');
    await expect(page.getByLabel(/how often/i)).toHaveValue('monthly');
  });

  test('saving cadence persists across modal reopen', async ({ page }) => {
    await page.getByLabel(/how often/i).selectOption('quarterly');
    await page.getByRole('button', { name: /^save$/i }).click();

    await page.getByRole('button', { name: /track progress/i }).first().click();
    await expect(page.getByLabel(/how often/i)).toHaveValue('quarterly');
  });
});

// ---------------------------------------------------------------------------
// TrackingModal — progress history (empty state)
// ---------------------------------------------------------------------------

test.describe('Tracking modal – empty progress history', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
  });

  test('shows empty state message when there are no check-ins', async ({ page }) => {
    await expect(page.getByText(/no check-ins yet/i)).toBeVisible();
  });

  test('shows the Add check-in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add check-in/i })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// CheckInModal — open / close
// ---------------------------------------------------------------------------

test.describe('CheckIn modal – open and close', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await page.getByRole('button', { name: /add check-in/i }).click();
  });

  test('clicking Add check-in opens the CheckIn modal', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /record check-in/i })).toBeVisible();
  });

  test('CheckIn modal shows the goal title and target', async ({ page }) => {
    await expect(
      page.getByRole('dialog', { name: /record check-in/i }).getByText(/house down payment/i)
    ).toBeVisible();
  });

  test('date field defaults to today', async ({ page }) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    await expect(page.getByLabel(/^date/i)).toHaveValue(`${yyyy}-${mm}-${dd}`);
  });

  test('amount field is initially empty', async ({ page }) => {
    await expect(page.getByLabel(/current amount/i)).toHaveValue('');
  });

  test('pressing Cancel closes the CheckIn modal and returns to TrackingModal', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: /cancel/i }).last().click();
    await expect(page.getByRole('heading', { name: /record check-in/i })).not.toBeVisible();
    // TrackingModal should still be open
    await expect(page.getByRole('heading', { name: /track progress/i })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// CheckInModal — happy path: record a check-in
// ---------------------------------------------------------------------------

test.describe('CheckIn modal – record check-in (happy path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
    await page.getByRole('button', { name: /add check-in/i }).click();
  });

  test('shows live fulfillment bar after entering an amount', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('25000');
    // 25000/50000 = 50% — the preview should be visible
    await expect(page.getByText(/50% of target reached/i)).toBeVisible();
  });

  test('save button is disabled when amount is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^save$/i }).last()).toBeDisabled();
  });

  test('save button is enabled after filling in a valid amount', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('10000');
    await expect(page.getByRole('button', { name: /^save$/i }).last()).toBeEnabled();
  });

  test('saving a check-in closes the CheckIn modal', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('10000');
    await page.getByRole('button', { name: /^save$/i }).last().click();
    await expect(page.getByRole('heading', { name: /record check-in/i })).not.toBeVisible();
  });

  test('after saving check-in the TrackingModal remains open', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('10000');
    await page.getByRole('button', { name: /^save$/i }).last().click();
    // TrackingModal should still be visible
    await expect(page.getByRole('heading', { name: /track progress/i })).toBeVisible();
  });

  test('saved check-in appears in progress history', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('10000');
    await page.getByLabel(/note/i).fill('Monthly contribution');
    await page.getByRole('button', { name: /^save$/i }).last().click();

    // History entry should be visible in the TrackingModal
    await expect(page.getByText(/monthly contribution/i)).toBeVisible();
  });

  test('saving a check-in shows a success toast', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('10000');
    await page.getByRole('button', { name: /^save$/i }).last().click();
    await expect(page.getByText(/check-in recorded/i)).toBeVisible();
  });

  test('fulfillment bar appears on the goal card after a check-in', async ({ page }) => {
    await page.getByLabel(/current amount/i).fill('25000');
    await page.getByRole('button', { name: /^save$/i }).last().click();

    // Close the TrackingModal
    await page.getByRole('button', { name: /^save$/i }).click();

    // The goal card should now show a fulfillment percentage
    await expect(page.getByText('50%')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Tracking modal – goal with existing check-ins
// ---------------------------------------------------------------------------

test.describe('Tracking modal – with existing check-ins', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([goalWithCheckIn])(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /track progress/i }).first().click();
  });

  test('shows fulfillment percentage in the modal', async ({ page }) => {
    // 12500/50000 = 25%
    await expect(
      page.getByRole('dialog', { name: /track progress/i }).getByText('25%')
    ).toBeVisible();
  });

  test('shows existing check-in amount in history', async ({ page }) => {
    await expect(page.getByText(/first quarter contribution/i)).toBeVisible();
  });

  test('fulfillment bar is visible on the goal card', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.getByText('25%')).toBeVisible();
  });

  test('delete button removes a check-in from history', async ({ page }) => {
    await expect(page.getByText(/first quarter contribution/i)).toBeVisible();
    // Click the delete button next to the check-in
    await page.getByTitle(/delete this check-in/i).click();
    await expect(page.getByText(/first quarter contribution/i)).not.toBeVisible();
    await expect(page.getByText(/no check-ins yet/i)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Goal card — fulfillment indicator
// ---------------------------------------------------------------------------

test.describe('Goal card – fulfillment indicator', () => {
  test('no fulfillment bar when goal has no check-ins', async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await seedStorage([testGoal])(page);
    await page.goto('/dashboard');

    // Neither "On track" nor "Behind schedule" should appear
    await expect(page.getByText(/on track/i)).not.toBeVisible();
    await expect(page.getByText(/behind schedule/i)).not.toBeVisible();
  });

  test('shows on-track status when ahead of linear target', async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    // Goal is 180 days old, 2 years total → ~25% elapsed → expected $12,500
    // Check-in of $20,000 is above expected → on track
    const goalAhead = {
      ...testGoal,
      checkIns: [{
        id: 'ci_ahead',
        date: '2026-06-01',
        currentAmount: 20000,
        createdAt: new Date().toISOString(),
      }],
    };
    await seedStorage([goalAhead])(page);
    await page.goto('/dashboard');
    await expect(page.getByText(/on track/i)).toBeVisible();
  });
});
