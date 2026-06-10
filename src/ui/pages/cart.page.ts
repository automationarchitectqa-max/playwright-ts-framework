import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  get pageUrl(): string {
    return '/cart.html';
  }

  async isLoaded(): Promise<void> {
    await this.waitForVisible(this.pageTitle);
    await expect(this.page).toHaveURL(/cart/);
  }

  async getCartItemCount(): Promise<number> {
    return this.getCount(this.cartItems);
  }

  async getCartItemNames(): Promise<string[]> {
    return this.getAllTexts(this.cartItemNames);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickButton(this.checkoutButton);
    await this.waitForUrl(/checkout-step-one/);
  }

  async continueShopping(): Promise<void> {
    await this.clickButton(this.continueShoppingButton);
    await this.waitForUrl(/inventory/);
  }

  async assertItemPresent(productName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: productName })
    ).toBeVisible();
  }

  async assertCartEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
}
