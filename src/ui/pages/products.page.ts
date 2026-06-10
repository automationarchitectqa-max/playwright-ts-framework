import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class ProductsPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator(
      '[data-test="product-sort-container"], [data-test="product_sort_container"], .product_sort_container'
    );
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  // ─── Page Identity ────────────────────────────────────────────────────────

  get pageUrl(): string {
    return '/inventory.html';
  }

  async isLoaded(): Promise<void> {
    await this.waitForVisible(this.pageTitle);
    await expect(this.page).toHaveURL(/inventory/);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async sortProducts(option: SortOption): Promise<void> {
    await this.selectDropdown(this.sortDropdown, { value: option });
    await expect(this.productItems.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    const addButton = item.locator('[data-test^="add-to-cart"]');
    await this.clickButton(addButton);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    const removeButton = item.locator('[data-test^="remove"]');
    await this.clickButton(removeButton);
  }

  async openCart(): Promise<void> {
    await this.clickButton(this.cartIcon);
    await this.waitForUrl(/cart/);
  }

  async logout(): Promise<void> {
    await this.clickButton(this.menuButton);
    await this.waitForVisible(this.logoutLink);
    await this.clickButton(this.logoutLink);
    await this.waitForUrl(/saucedemo\.com\/?$/);
  }

  async openProductDetail(productName: string): Promise<void> {
    const link = this.page.locator('.inventory_item_name', { hasText: productName });
    await this.clickButton(link);
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  async getProductCount(): Promise<number> {
    return this.getCount(this.productItems);
  }

  async getProductNames(): Promise<string[]> {
    return this.getAllTexts(this.productNames);
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.getAllTexts(this.productPrices);
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async getCartItemCount(): Promise<number> {
    const visible = await this.isVisible(this.cartBadge);
    if (!visible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Products');
    await expect(this.productItems.first()).toBeVisible();
  }

  async assertCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(String(expected));
    }
  }

  async assertProductsSortedAscending(): Promise<void> {
    const names = await this.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }
}
