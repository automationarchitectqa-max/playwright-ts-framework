/**
 * Login UI Tests
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates:
 *  ✓ Data-driven UI tests via CsvDataProvider (TestNG-style sheetName pattern)
 *  ✓ Page Object Model usage
 *  ✓ Fixture-based setup/teardown (TestNG @BeforeMethod equivalent)
 *  ✓ Node/child test grouping
 *  ✓ Tags for CI filtering
 */

import { expect } from '@playwright/test';
import { test } from '../../src/fixtures';
import { CsvDataProvider } from '../../src/core/utils/csv-data-provider';
import { TestHelper } from '../../src/helpers/test-helper';

// ─── Node: Successful Login ───────────────────────────────────────────────

test.describe('@ui @smoke — Login: Successful Scenarios', () => {
  // Pull all rows for sheetName = 'login_success' → 2 rows → 2 test runs
  const successRows = CsvDataProvider.getRows({
    file: 'login',
    sheetName: 'login_success',
  });

  for (const data of successRows) {
    const username = CsvDataProvider.get(data, 'username');
    const password = CsvDataProvider.get(data, 'password');
    const expectedTitle = CsvDataProvider.get(data, 'expected_title');

    test(`@smoke Login success — ${username}`, async ({ loginPage, productsPage }, testInfo) => {
      TestHelper.annotate(testInfo, {
        suite: 'Login UI',
        feature: 'Authentication',
        story: 'Successful Login',
        tags: ['@ui', '@smoke'],
      });

      await TestHelper.step('Navigate to login page', async () => {
        await loginPage.navigate();
      });

      await TestHelper.step(`Login as ${username}`, async () => {
        await loginPage.login(username, password);
      });

      await TestHelper.step('Verify redirect to products page', async () => {
        await productsPage.isLoaded();
        await expect(productsPage.pageTitle).toContainText(expectedTitle);
      });
    });
  }
});

// ─── Node: Failed Login ───────────────────────────────────────────────────

test.describe('@ui @regression — Login: Failure Scenarios', () => {
  // Pull all rows for sheetName = 'login_failure' → 4 rows → 4 test runs
  const failureRows = CsvDataProvider.getRows({
    file: 'login',
    sheetName: 'login_failure',
  });

  for (const data of failureRows) {
    const username = CsvDataProvider.getOptional(data, 'username', '(empty)');
    const password = CsvDataProvider.getOptional(data, 'password', '(empty)');
    const expectedError = CsvDataProvider.get(data, 'expected_error');

    test(`@regression Login failure — "${username}"`, async ({ loginPage }, testInfo) => {
      TestHelper.annotate(testInfo, {
        suite: 'Login UI',
        feature: 'Authentication',
        story: 'Failed Login',
        tags: ['@ui', '@regression'],
      });

      await TestHelper.step('Navigate to login page', async () => {
        await loginPage.navigate();
      });

      await TestHelper.step('Attempt login with invalid credentials', async () => {
        const actualUsername = username === '(empty)' ? '' : username;
        const actualPassword = password === '(empty)' ? '' : password;
        await loginPage.login(actualUsername, actualPassword);
      });

      await TestHelper.step('Verify error message', async () => {
        await loginPage.assertErrorVisible(expectedError);
        const errorText = await loginPage.getErrorMessage();

        await TestHelper.attachText(
          testInfo,
          'Error Message',
          errorText
        );
      });
    });
  }
});

// ─── Node: Login Hooks (TestNG @BeforeMethod / @AfterMethod) ─────────────

test.describe('@ui — Login: Hook Lifecycle Demo', () => {
  // TestNG @BeforeMethod equivalent
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // TestNG @AfterMethod equivalent
  test.afterEach(async ({ page }) => {
    // Optionally clear cookies / storage between tests
    await page.context().clearCookies();
  });

  test('@smoke should clear error on dismiss', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.assertErrorVisible();
    await loginPage.dismissError();
    await loginPage.assertErrorHidden();
  });

  test('@regression login button should be present and enabled', async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
