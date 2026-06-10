/**
 * MockServer
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Playwright's built-in route interception to mock API responses.
 * No external mock server needed.
 *
 * Usage:
 *   const mock = new MockServer(page);
 *   await mock.mockGet('/api/users', 200, { data: [...] });
 *   // test runs, page calls /api/users, gets mocked response
 *   await mock.clearAll();
 */

import { Page, Route, Request } from '@playwright/test';
import { Logger } from '../core/utils/logger';

export interface MockDefinition {
  pattern: string | RegExp;
  method?: string;
  status: number;
  body: unknown;
  headers?: Record<string, string>;
  delay?: number;
}

export class MockServer {
  private mocks: MockDefinition[] = [];

  constructor(private readonly page: Page) {}

  // ─── Registration ─────────────────────────────────────────────────────────

  async mockGet(
    pattern: string | RegExp,
    status: number,
    body: unknown,
    options?: { headers?: Record<string, string>; delay?: number }
  ): Promise<void> {
    return this.addMock({ pattern, method: 'GET', status, body, ...options });
  }

  async mockPost(
    pattern: string | RegExp,
    status: number,
    body: unknown,
    options?: { headers?: Record<string, string>; delay?: number }
  ): Promise<void> {
    return this.addMock({ pattern, method: 'POST', status, body, ...options });
  }

  async mockPut(
    pattern: string | RegExp,
    status: number,
    body: unknown,
    options?: { headers?: Record<string, string>; delay?: number }
  ): Promise<void> {
    return this.addMock({ pattern, method: 'PUT', status, body, ...options });
  }

  async mockDelete(
    pattern: string | RegExp,
    status: number,
    body: unknown
  ): Promise<void> {
    return this.addMock({ pattern, method: 'DELETE', status, body });
  }

  /** Mock a slow response to test loading states / timeout handling */
  async mockSlowResponse(
    pattern: string | RegExp,
    status: number,
    body: unknown,
    delayMs: number
  ): Promise<void> {
    return this.addMock({ pattern, status, body, delay: delayMs });
  }

  /** Mock a network failure (no response at all) */
  async mockNetworkFailure(pattern: string | RegExp): Promise<void> {
    await this.page.route(pattern, async (route: Route) => {
      Logger.info(`[MockServer] Aborting request to: ${route.request().url()}`);
      await route.abort('failed');
    });
  }

  // ─── Clear ────────────────────────────────────────────────────────────────

  async clearAll(): Promise<void> {
    await this.page.unrouteAll({ behavior: 'wait' });
    this.mocks = [];
    Logger.info('[MockServer] All mocks cleared');
  }

  async clearMock(pattern: string | RegExp): Promise<void> {
    await this.page.unroute(pattern);
    this.mocks = this.mocks.filter((m) => m.pattern !== pattern);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private async addMock(definition: MockDefinition): Promise<void> {
    this.mocks.push(definition);

    await this.page.route(definition.pattern, async (route: Route, request: Request) => {
      const method = request.method();

      // Method filter
      if (definition.method && method !== definition.method) {
        await route.continue();
        return;
      }

      Logger.info(
        `[MockServer] Intercepting ${method} ${request.url()} → status ${definition.status}`
      );

      // Artificial delay
      if (definition.delay && definition.delay > 0) {
        await new Promise((r) => setTimeout(r, definition.delay));
      }

      await route.fulfill({
        status: definition.status,
        contentType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          ...definition.headers,
        },
        body: JSON.stringify(definition.body),
      });
    });
  }
}
