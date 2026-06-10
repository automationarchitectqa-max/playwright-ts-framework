/**
 * Products UI Tests
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the `authenticatedPage` fixture — equivalent to TestNG's
 * @BeforeClass with login handled once.
 */

import { expect } from '@playwright/test';
import { test } from '../../src/fixtures';
import { ProductsPage } from '../../src/ui/pages/products.page';
import { CartPage } from '../../src/ui/pages/cart.page';
import { TestHelper } from '../../src/helpers/test-helper';

test.describe('@ui @smoke — Products Page', () => {
  // TestNG @BeforeClass equivalent: login happens once in fixture
  test.use({});

  test('@smoke products page loads with inventory', async ({
    authenticatedPage,
  }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'Products UI',
      feature: 'Inventory',
      story: 'Page Load',
      tags: ['@ui', '@smoke'],
    });

    const products = new ProductsPage(authenticatedPage);

    await TestHelper.step('Verify products page loaded', async () => {
      await products.assertPageLoaded();
      const count = await products.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('@smoke should list 6 products by default', async ({
    authenticatedPage,
  }) => {
    const products = new ProductsPage(authenticatedPage);
    const count = await products.getProductCount();
    expect(count).toBe(6);
  });

  test('@regression sort products A-Z', async ({ authenticatedPage }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'Products UI',
      feature: 'Sorting',
      story: 'Sort A-Z',
      tags: ['@ui', '@regression'],
    });

    const products = new ProductsPage(authenticatedPage);

    await TestHelper.step('Sort products A→Z', async () => {
      await products.sortProducts('az');
    });

    await TestHelper.step('Verify alphabetical order', async () => {
      await products.assertProductsSortedAscending();
    });
  });

  test('@regression sort products by price low-to-high', async ({
    authenticatedPage,
  }) => {
    const products = new ProductsPage(authenticatedPage);
    await products.sortProducts('lohi');

    const prices = await products.getProductPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });
});

// ─── Node: Shopping Cart ──────────────────────────────────────────────────

test.describe('@ui @regression — Cart Operations', () => {
  test('@regression add product to cart', async ({
    authenticatedPage,
  }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'Products UI',
      feature: 'Cart',
      story: 'Add to Cart',
      tags: ['@ui', '@regression'],
    });

    const products = new ProductsPage(authenticatedPage);
    const productName = 'Sauce Labs Backpack';

    await TestHelper.step('Add product to cart', async () => {
      await products.addProductToCart(productName);
    });

    await TestHelper.step('Verify cart badge shows 1', async () => {
      await products.assertCartCount(1);
    });
  });

  test('@regression add multiple products and verify cart', async ({
    authenticatedPage,
  }, testInfo) => {
    TestHelper.annotate(testInfo, {
      suite: 'Products UI',
      feature: 'Cart',
      story: 'Add Multiple Items',
      tags: ['@ui', '@regression'],
    });

    const products = new ProductsPage(authenticatedPage);
    const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await TestHelper.step('Add two products to cart', async () => {
      for (const item of items) {
        await products.addProductToCart(item);
      }
    });

    await TestHelper.step('Verify cart badge shows 2', async () => {
      await products.assertCartCount(2);
    });

    await TestHelper.step('Open cart and verify items', async () => {
      await products.openCart();
      const cart = new CartPage(authenticatedPage);
      await cart.isLoaded();

      for (const item of items) {
        await cart.assertItemPresent(item);
      }
    });
  });

  test('@regression remove product from cart', async ({ authenticatedPage }) => {
    const products = new ProductsPage(authenticatedPage);
    const productName = 'Sauce Labs Backpack';

    await products.addProductToCart(productName);
    await products.assertCartCount(1);
    await products.removeProductFromCart(productName);
    await products.assertCartCount(0);
  });
});
