/**
 * API Fixtures
 * ─────────────────────────────────────────────────────────────────────────────
 * Purpose:
 *   Creates API-related objects and injects them into tests.
 *
 * TestNG Equivalent:
 *   Similar to creating objects inside @BeforeMethod and making
 *   them available to test methods.
 *
 * Available Fixtures:
 *   • apiClient - Reusable HTTP client for API requests
 *
 * Example:
 *
 *   test('Get User', async ({ apiClient }) => {
 *      const response = await apiClient.get('/users/1');
 *   });
 *
 * Flow:
 *
 *   Playwright Request Context
 *              ↓
 *          ApiClient
 *              ↓
 *            Test
 */

import { test as base } from '@playwright/test';
import { ApiClient } from '../../api/client/api-client';

type ApiFixtures = {
  apiClient: ApiClient;
};

const BASE_URL = process.env.API_BASE_URL!;

export const apiTest = base.extend<ApiFixtures>({

  apiClient: async ({ request }, use) => {
    console.log(`[ApiFixture] API_BASE_URL from env: ${BASE_URL}`);
    
    const apiClient = new ApiClient(
      request,
      BASE_URL
    );

    await use(apiClient);
  },

});