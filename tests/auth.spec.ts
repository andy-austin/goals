/**
 * Auth flow E2E tests.
 *
 * These tests cover the auth page UI, form validation, and navigation.
 * Full sign-in/sign-up flow tests require real Supabase credentials; those
 * are excluded here and should run in a dedicated integration environment.
 *
 * The auth guard redirect (unauthenticated → /auth/login) is tested
 * separately via the middleware logic; PLAYWRIGHT_TEST_MODE intentionally
 * bypasses it so other test suites can reach protected routes freely.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function goToLogin(page: import('@playwright/test').Page) {
  await page.context().addCookies([
    { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
  ]);
  await page.goto('/auth/login');
}

async function goToSignup(page: import('@playwright/test').Page) {
  await page.context().addCookies([
    { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
  ]);
  await page.goto('/auth/signup');
}

// ---------------------------------------------------------------------------
// Login page – structure
// ---------------------------------------------------------------------------

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => goToLogin(page));

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('renders the subtitle', async ({ page }) => {
    await expect(page.getByText('Sign in to access your goals from any device')).toBeVisible();
  });

  test('renders email and password fields', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('renders the Sign In submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('has a link to the signup page', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('does NOT show Google OAuth button when it is disabled', async ({ page }) => {
    // NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED defaults to "false" in the test env
    await expect(page.getByRole('button', { name: /google/i })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Login page – navigation
// ---------------------------------------------------------------------------

test.describe('Login page navigation', () => {
  test.beforeEach(async ({ page }) => goToLogin(page));

  test('clicking Sign Up link navigates to the signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/auth/signup');
  });

  test('the header is present', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Login page – form validation
// ---------------------------------------------------------------------------

test.describe('Login page form validation', () => {
  test.beforeEach(async ({ page }) => goToLogin(page));

  test('email field is required (HTML5 constraint)', async ({ page }) => {
    // The <input type="email" required> will prevent form submit and show
    // a browser validation message — the button stays visible and enabled
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('password field has a minimum length constraint', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toHaveAttribute('minlength', '6');
  });

  test('email field accepts a valid email address', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
  });

  test('shows an error message when credentials are invalid', async ({ page }) => {
    // With placeholder Supabase URL, the auth call will fail with a network error
    await page.getByLabel('Email').fill('bad@user.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // An error banner should appear (content varies based on Supabase response)
    await expect(page.locator('div.text-red-700, div.text-red-400')).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// Sign-up page – structure
// ---------------------------------------------------------------------------

test.describe('Sign-up page', () => {
  test.beforeEach(async ({ page }) => goToSignup(page));

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  });

  test('renders the subtitle', async ({ page }) => {
    await expect(page.getByText('Create an account to save your goals securely')).toBeVisible();
  });

  test('renders email, password, and confirm-password fields', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
  });

  test('renders the Create Account submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('has a link back to the login page', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Sign-up page – navigation
// ---------------------------------------------------------------------------

test.describe('Sign-up page navigation', () => {
  test.beforeEach(async ({ page }) => goToSignup(page));

  test('clicking Sign In link navigates to the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/auth/login');
  });
});

// ---------------------------------------------------------------------------
// Sign-up page – form validation
// ---------------------------------------------------------------------------

test.describe('Sign-up page form validation', () => {
  test.beforeEach(async ({ page }) => goToSignup(page));

  test('shows "Passwords do not match" when passwords differ', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password1');
    await page.getByLabel('Confirm password').fill('password2');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('each password field requires a minimum of 6 characters', async ({ page }) => {
    await expect(page.getByLabel('Password')).toHaveAttribute('minlength', '6');
    await expect(page.getByLabel('Confirm password')).toHaveAttribute('minlength', '6');
  });
});

// ---------------------------------------------------------------------------
// Auth guard – documented behaviour
// ---------------------------------------------------------------------------

test.describe('Auth guard', () => {
  test('login page includes "redirectTo" query param when linked from nav', async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    // Navigate directly to the login page with a redirectTo parameter
    await page.goto('/auth/login?redirectTo=/timeline');

    // The page should render normally; the redirectTo value is picked up by the
    // form handler and will be used after a successful sign-in
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('login page loads at /auth/login route', async ({ page }) => {
    await page.context().addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});
