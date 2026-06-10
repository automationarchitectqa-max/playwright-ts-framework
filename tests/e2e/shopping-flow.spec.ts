/**
 * E2E Test: Login → Products → Cart → Logout (with API Mock)
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates:
 *  ✓ Full end-to-end flow across multiple pages
 *  ✓ MockServer intercepting API calls
 *  ✓ Combining UI page objects + API assertions
 *  ✓ Step-by-step reporting
 */

import { expect } from '@playwright/test';
import { test } from '../../src/fixtures';
import { LoginPage } from '../../src/ui/pages/login.page';
import { ProductsPage } from '../../src/ui/pages/products.page';
import { CartPage } from '../../src/ui/pages/cart.page';
import { HeaderComponent } from '../../src/ui/components/header.component';
import { MockServer } from '../../src/mock/mock-server';
import { TestHelper } from '../../src/helpers/test-helper';

test.describe('@e2e @smoke — Full Shopping Flow', () => {
  test('@smoke complete shopping workflow', async ({ page }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'E2E',
      feature: 'Shopping Flow',
      story: 'Login → Add to Cart → Verify Cart',
      tags: ['@e2e', '@smoke'],
    });

    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await TestHelper.step('1. Navigate and Login', async () => {
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');
      await productsPage.isLoaded();
    });

    await TestHelper.step('2. Verify inventory loaded', async () => {
      await productsPage.assertPageLoaded();
      const count = await productsPage.getProductCount();
      expect(count).toBe(6);
    });

    await TestHelper.step('3. Add two items to cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Fleece Jacket');
      await productsPage.assertCartCount(2);
    });

    await TestHelper.step('4. Navigate to cart', async () => {
      await productsPage.openCart();
      await cartPage.isLoaded();
    });

    await TestHelper.step('5. Verify cart contents', async () => {
      await cartPage.assertItemPresent('Sauce Labs Backpack');
      await cartPage.assertItemPresent('Sauce Labs Fleece Jacket');
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(2);
    });

    await TestHelper.step('6. Logout', async () => {
      const header = new HeaderComponent(page);
      await header.clickLogout();
      await loginPage.isLoaded();
    });
  });
});

// ─── E2E with Mock: API interception ─────────────────────────────────────

test.describe('@e2e @regression — E2E with Mock Server', () => {
  test('@regression should display mocked product data', async ({ page }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'E2E Mock',
      feature: 'Mock Interception',
      story: 'Mocked API Response',
      tags: ['@e2e', '@regression'],
    });

    const mock = new MockServer(page);

    try {
      await TestHelper.step('Setup mock: intercept inventory API', async () => {
        await mock.mockGet(
          /\/api\/inventory$/,
          200,
          [
            { id: 1, name: 'Mock Product A', price: 9.99 },
            { id: 2, name: 'Mock Product B', price: 19.99 },
          ]
        );
      });

      await TestHelper.step('Fetch and verify mocked inventory', async () => {
        await page.route('https://mock.test/', async (route) => {
          await route.fulfill({ contentType: 'text/html', body: '<html></html>' });
        });
        await page.goto('https://mock.test/');
        const products = await page.evaluate(async () => {
          const response = await fetch('/api/inventory');
          return response.json();
        });

        expect(products).toHaveLength(2);
        expect(products[0]).toMatchObject({
          id: 1,
          name: 'Mock Product A',
          price: 9.99,
        });
      });
    } finally {
      await mock.clearAll();
    }
  });

  test('@regression should handle slow API response gracefully', async ({ page }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'E2E Mock',
      feature: 'Mock Latency',
      story: 'Slow Response Handling',
      tags: ['@e2e', '@regression'],
    });

    const mock = new MockServer(page);

    try {
      await TestHelper.step('Mock 2 second delayed response', async () => {
        await mock.mockSlowResponse(
          /\/api\/users$/,
          200,
          { data: [], total: 0 },
          2000
        );
      });

      await TestHelper.step('Fetch and verify delayed response', async () => {
        await page.route('https://mock.test/', async (route) => {
          await route.fulfill({ contentType: 'text/html', body: '<html></html>' });
        });
        await page.goto('https://mock.test/');
        const start = Date.now();
        const body = await page.evaluate(async () => {
          const response = await fetch('/api/users');
          return response.json();
        });
        const elapsedMs = Date.now() - start;

        expect(body).toEqual({ data: [], total: 0 });
        expect(elapsedMs).toBeGreaterThanOrEqual(1900);
      });
    } finally {
      await mock.clearAll();
    }
  });
});
