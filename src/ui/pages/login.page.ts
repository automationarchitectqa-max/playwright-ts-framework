import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
  }

  // ─── Page Identity ────────────────────────────────────────────────────────

  get pageUrl(): string {
    return '/';
  }

  async isLoaded(): Promise<void> {
    await this.waitForVisible(this.loginButton);
    await expect(this.page).toHaveURL(/saucedemo/);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.clickButton(this.loginButton);
  }

  /** High-level compound action — logs in and returns to caller */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  async dismissError(): Promise<void> {
    await this.clickButton(this.errorDismissButton);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertErrorVisible(expectedText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

  async assertErrorHidden(): Promise<void> {
    await expect(this.errorMessage).toBeHidden();
  }
}
