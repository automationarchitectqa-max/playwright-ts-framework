import { Locator, Page, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * UiAssertions
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized UI assertion library for Playwright.
 *
 * Purpose:
 * - Keep raw expect() statements out of test classes.
 * - Provide meaningful Allure reporting.
 * - Standardize UI validation across the framework.
 *
 * Usage:
 *
 * await UiAssertions.assertVisible(
 *   loginPage.loginButton,
 *   'Validate Login button is visible'
 * );
 *
 * await UiAssertions.assertText(
 *   loginPage.header,
 *   'Welcome',
 *   'Validate welcome message'
 * );
 *
 * Allure Output:
 *
 * ✓ Validate Login button is visible
 * ✓ Validate welcome message
 *
 * Benefits:
 * - Consistent reporting
 * - Cleaner tests
 * - Easier maintenance
 * - Framework-level assertion handling
 */
export class UiAssertions {

  /**
   * Validate that an element is visible.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertVisible(
    locator: Locator,
    message = 'Validate element is visible'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).toBeVisible();
    });
  }

  /**
   * Validate that an element is hidden.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertHidden(
    locator: Locator,
    message = 'Validate element is hidden'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).toBeHidden();
    });
  }

  /**
   * Validate that element text exactly matches expected text.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param text
   *        Expected text value.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertText(
    locator: Locator,
    text: string,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate text equals '${text}'`,
      async () => {
        await expect(locator).toHaveText(text);
      }
    );
  }

  /**
   * Validate that element text contains expected text.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param text
   *        Expected partial text.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertContainsText(
    locator: Locator,
    text: string,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate text contains '${text}'`,
      async () => {
        await expect(locator).toContainText(text);
      }
    );
  }

  /**
   * Validate that an element is enabled.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertEnabled(
    locator: Locator,
    message = 'Validate element is enabled'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).toBeEnabled();
    });
  }

  /**
   * Validate that an element is disabled.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertDisabled(
    locator: Locator,
    message = 'Validate element is disabled'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).toBeDisabled();
    });
  }

  /**
   * Validate that a checkbox or radio button is checked.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertChecked(
    locator: Locator,
    message = 'Validate checkbox is checked'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).toBeChecked();
    });
  }

  /**
   * Validate that a checkbox or radio button is not checked.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertNotChecked(
    locator: Locator,
    message = 'Validate checkbox is not checked'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(locator).not.toBeChecked();
    });
  }

  /**
   * Validate element count.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param count
   *        Expected number of elements.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertCount(
    locator: Locator,
    count: number,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate count equals ${count}`,
      async () => {
        await expect(locator).toHaveCount(count);
      }
    );
  }

  /**
   * Validate page URL.
   *
   * @param page
   *        Playwright page instance.
   *
   * @param pattern
   *        Expected URL or regex pattern.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertUrl(
    page: Page,
    pattern: string | RegExp,
    message = 'Validate page URL'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(page).toHaveURL(pattern);
    });
  }

  /**
   * Validate page title.
   *
   * @param page
   *        Playwright page instance.
   *
   * @param title
   *        Expected title or regex pattern.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertTitle(
    page: Page,
    title: string | RegExp,
    message = 'Validate page title'
  ): Promise<void> {

    await allure.step(message, async () => {
      await expect(page).toHaveTitle(title);
    });
  }

  /**
   * Validate input field value.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param value
   *        Expected input value.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertInputValue(
    locator: Locator,
    value: string,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate input value equals '${value}'`,
      async () => {
        await expect(locator).toHaveValue(value);
      }
    );
  }

  /**
   * Validate element attribute value.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param attr
   *        Attribute name.
   *
   * @param value
   *        Expected attribute value.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertAttributeValue(
    locator: Locator,
    attr: string,
    value: string,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate attribute '${attr}' equals '${value}'`,
      async () => {
        await expect(locator).toHaveAttribute(attr, value);
      }
    );
  }

  /**
   * Validate CSS class exists on element.
   *
   * @param locator
   *        Playwright locator.
   *
   * @param className
   *        Expected CSS class.
   *
   * @param message
   *        Custom message displayed in Allure report.
   */
  static async assertCssClass(
    locator: Locator,
    className: string,
    message?: string
  ): Promise<void> {

    await allure.step(
      message ?? `Validate CSS class contains '${className}'`,
      async () => {
        await expect(locator).toHaveClass(
          new RegExp(className)
        );
      }
    );
  }
}