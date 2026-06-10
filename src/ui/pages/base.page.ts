/**
 * BasePage
 * ─────────────────────────────────────────────────────────────────────────────
 * All page objects extend this class. Provides:
 *  • Smart waits (visible, hidden, network idle, URL, etc.)
 *  • Element interaction helpers (click, type, select, checkbox, radio)
 *  • Navigation helpers
 *  • Assertion shortcuts
 */

import { Page, Locator, expect } from '@playwright/test';
import { WaitOptions, SelectOption } from '../../types';
import { Logger } from '../../core/utils/logger';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Abstract ─────────────────────────────────────────────────────────────

  /** Each page declares its own path for navigation */
  abstract get pageUrl(): string;

  /** Called after navigation — validates the page loaded correctly */
  abstract isLoaded(): Promise<void>;

  // ─── Navigation ───────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    Logger.info(`Navigating to: ${this.pageUrl}`);
    await this.page.goto(this.pageUrl);
    await this.isLoaded();
  }

  async navigateTo(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  // ─── Smart Waits ──────────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, options?: WaitOptions): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: options?.timeout ?? 10_000,
    });
  }

  async waitForHidden(locator: Locator, options?: WaitOptions): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: options?.timeout ?? 10_000,
    });
  }

  async waitForEnabled(locator: Locator, timeout = 10_000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  async waitForNetworkIdle(timeout = 30_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForDomContentLoaded(timeout = 30_000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  async waitForUrl(urlPattern: string | RegExp, timeout = 15_000): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  async waitForText(locator: Locator, text: string, timeout = 10_000): Promise<void> {
    await expect(locator).toContainText(text, { timeout });
  }

  async waitForSelector(selector: string, options?: WaitOptions): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({
      state: options?.state ?? 'visible',
      timeout: options?.timeout ?? 10_000,
    });
    return locator;
  }

  // ─── Click Helpers ────────────────────────────────────────────────────────

  /** Click a standard button / link */
  async clickButton(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await this.waitForEnabled(locator);
    Logger.debug(`Clicking element: ${await this.describeLocator(locator)}`);
    await locator.click();
  }

  /** Force-click — bypasses visibility checks (use sparingly) */
  async forceClick(locator: Locator): Promise<void> {
    Logger.debug(`Force-clicking: ${await this.describeLocator(locator)}`);
    await locator.click({ force: true });
  }

  /** Click and wait for navigation to complete */
  async clickAndWaitForNavigation(locator: Locator, urlPattern?: string | RegExp): Promise<void> {
    await this.waitForVisible(locator);
    await Promise.all([
      urlPattern
        ? this.page.waitForURL(urlPattern, { timeout: 15_000 })
        : this.page.waitForLoadState('networkidle'),
      locator.click(),
    ]);
  }

  // ─── Input Helpers ────────────────────────────────────────────────────────

  /** Clear existing value, then type new text */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForVisible(locator);
    await this.waitForEnabled(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /** Type character-by-character (useful for autocomplete fields) */
  async typeSlowly(locator: Locator, text: string, delay = 50): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.pressSequentially(text, { delay });
  }

  async clearInput(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  // ─── Select / Dropdown ────────────────────────────────────────────────────

  /** Select a <select> option by value, label, or index */
  async selectDropdown(locator: Locator, option: SelectOption): Promise<void> {
    await this.waitForVisible(locator);
    if (option.value !== undefined) {
      await locator.selectOption({ value: option.value });
    } else if (option.label !== undefined) {
      await locator.selectOption({ label: option.label });
    } else if (option.index !== undefined) {
      await locator.selectOption({ index: option.index });
    } else {
      throw new Error('[BasePage.selectDropdown] Must provide value, label, or index');
    }
  }

  // ─── Checkbox ─────────────────────────────────────────────────────────────

  async checkCheckbox(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    const isChecked = await locator.isChecked();
    if (!isChecked) await locator.check();
  }

  async uncheckCheckbox(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    const isChecked = await locator.isChecked();
    if (isChecked) await locator.uncheck();
  }

  async toggleCheckbox(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  // ─── Radio Button ─────────────────────────────────────────────────────────

  /** Click a radio button (only if not already selected) */
  async selectRadio(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    const isChecked = await locator.isChecked();
    if (!isChecked) await locator.click();
  }

  // ─── Text / Value Getters ─────────────────────────────────────────────────

  async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await locator.textContent()) ?? '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return locator.inputValue();
  }

  async getAllTexts(locator: Locator): Promise<string[]> {
    return locator.allTextContents();
  }

  async getAttribute(locator: Locator, attr: string): Promise<string | null> {
    return locator.getAttribute(attr);
  }

  // ─── State Checks ─────────────────────────────────────────────────────────

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  async getCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  // ─── Scroll ───────────────────────────────────────────────────────────────

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // ─── Screenshot ───────────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async describeLocator(locator: Locator): Promise<string> {
    try {
      return String(locator);
    } catch {
      return '[locator]';
    }
  }
}
