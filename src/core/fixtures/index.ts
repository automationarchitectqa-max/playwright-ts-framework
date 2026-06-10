/**
 * fixtures/index.ts
 * Central fixture registry — merges UI + API fixtures.
 *
 * Always import from here, never from '@playwright/test' directly:
 *   import { test, expect } from '@fixtures/index';
 *
 * TestNG mapping:
 *   fixture setup (before await use)  ≈ @BeforeMethod
 *   fixture teardown (after await use) ≈ @AfterMethod
 *   test.beforeAll / afterAll          ≈ @BeforeClass / @AfterClass
 *   globalSetup / globalTeardown       ≈ @BeforeSuite / @AfterSuite
 */


import { mergeTests, expect } from '@playwright/test';
import { uiTest }  from './ui.fixtures';
import { apiTest } from './api.fixtures';

export const test = mergeTests(uiTest, apiTest);
export { expect };
 