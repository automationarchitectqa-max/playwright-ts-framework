import { test as base } from '@playwright/test';
import { HeaderComponent } from '../../ui/components/header.component';
import { LoginPage } from '../../ui/pages/login.page';

type UiFixtures = {
  loginPage: LoginPage;
  header: HeaderComponent;
};

export const uiTest = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
});