/**
 * HeaderComponent
 * A reusable component class for the SauceDemo header.
 * Components are NOT pages — they don't extend BasePage.
 * They accept a Page reference and expose targeted actions.
 */

import { Page, Locator, expect } from '@playwright/test';

export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly sidebar: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  readonly resetLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.sidebar = page.locator('.bm-menu-wrap');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.sidebar.waitFor({ state: 'visible' });
  }

  async clickLogout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async clickAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await this.cartBadge.textContent() ?? '0', 10);
  }

  async assertCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(String(expected));
    }
  }
}
