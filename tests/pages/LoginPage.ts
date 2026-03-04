import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Adjust selectors below if the actual page uses different attributes
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.submitButton  = page.locator('button[type="submit"], input[type="submit"]').first();
    this.errorMessage  = page.locator([
      '[class*="error"]',
      '[class*="alert"]',
      '[role="alert"]',
      '[class*="notification"]',
      '[class*="toast"]',
      '[class*="snack"]',
      '[class*="message"]',
      '[role="status"]',
    ].join(', ')).first();
  }

  async goto() {
    await this.page.goto('/signin');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectPageNotToBeSignIn() {
    await expect(this.page).not.toHaveURL(/signin/);
  }

  /** Clicks submit without filling any fields */
  async submitEmpty() {
    await this.submitButton.click();
  }

  /** Asserts that either HTML5 field validation or a visible error is present */
  async expectEmptyFieldsValidation() {
    const usernameInvalid = await this.usernameInput.evaluate(
      (el) => !(el as HTMLInputElement).validity.valid
    );
    const hasVisibleError = await this.errorMessage.isVisible().catch(() => false);
    expect(usernameInvalid || hasVisibleError).toBeTruthy();
    await expect(this.page).toHaveURL(/signin/);
  }
}
