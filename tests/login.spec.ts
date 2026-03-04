import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

/**
 * Login tests for https://confighub-dev1.volvocars.net/signin
 *
 * ⚠️  Replace VALID_USERNAME / VALID_PASSWORD with real credentials,
 *     or supply them via environment variables before running.
 */

const VALID_USERNAME = 'aismail5';
const VALID_PASSWORD = 'dummypassword';
const INVALID_USER   = 'invalid';
const INVALID_PASS   = 'WrongPassword123!';

test.describe('Login Page - confighub-dev1', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/signin/);
  });

  // ------------------------------------------------------------------ //
  // TC-01: Valid credentials → user is redirected away from /signin     //
  // ------------------------------------------------------------------ //
  test('TC-01: should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    // After a successful login the app should redirect away from /signin
    await loginPage.expectPageNotToBeSignIn();
  });

  // ------------------------------------------------------------------ //
  // TC-02: Invalid username → error message shown                       //
  // ------------------------------------------------------------------ //
  test('TC-02: should show error message for invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(INVALID_USER, VALID_PASSWORD);

    await loginPage.expectErrorVisible();
    // User must remain on the sign-in page
    await expect(page).toHaveURL(/signin/);
  });

  // ------------------------------------------------------------------ //
  // TC-03: Invalid username + password → error message shown           //
  // Note: app uses SSO so password alone isn't enforced for valid users //
  // ------------------------------------------------------------------ //
  test('TC-03: should show error message for invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(INVALID_USER, INVALID_PASS);

    await loginPage.expectErrorVisible();
    await expect(page).toHaveURL(/signin/);
  });

});
