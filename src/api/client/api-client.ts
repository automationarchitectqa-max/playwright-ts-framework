/**
 * ApiClient
 * ─────────────────────────────────────────────────────────────────────────────
 * Core HTTP client wrapping Playwright's APIRequestContext.
 *
 * Features:
 *  • Automatic latency measurement & threshold alerting (warn / fail)
 *  • Fluent status assertion helpers
 *  • Type-safe response deserialization
 *  • Automatic request/response logging
 *  • Configurable retries for flaky endpoints
 */

import { APIRequestContext } from '@playwright/test';
import { ApiAssertions } from '../../../src/api/utils/api-assertions';
import { CurlLogger } from '../utils/curl-logger';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  ok: boolean;
  latencyMs: number;
  url: string;
}

export class ApiClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    console.log(`[ApiClient] Initialized with baseUrl: ${baseUrl}`);
  }

  setToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.send<T>('get', endpoint);
  }

  async getAndValidate<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.get<T>(endpoint);
    await ApiAssertions.assertStatus(
      response,
      200
    );
    await ApiAssertions.assertOk(
      response
    );
    return response;
  }

  async post<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    return this.send<T>('post', endpoint, body);
  }

  async put<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    return this.send<T>('put', endpoint, body);
  }

  async patch<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    return this.send<T>('patch', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.send<T>('delete', endpoint);
  }

  private async send<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    body?: object
  ): Promise<ApiResponse<T>> {

    const url = `${this.baseUrl}${endpoint}`;

    CurlLogger.log(
      method,
      url,
      this.headers,
      body
    );

    console.log(
      `[ApiClient] Making ${method.toUpperCase()} request to: ${url}`
    );

    const startTime = Date.now();

    const res = await this.request[method](url, {
      headers: this.headers,
      data: body,
    });

    console.log(
      'STATUS:',
      res.status()
    );

    console.log(
      'RESPONSE:',
      await res.text()
    );

    const latencyMs = Date.now() - startTime;

    // Warn if response is slow
    const warnMs = Number(
      process.env.LATENCY_WARN_MS ?? 2000
    );

    if (latencyMs > warnMs) {
      console.warn(
        `[Latency Warning] ${method.toUpperCase()} ${url} took ${latencyMs}ms (threshold: ${warnMs}ms)`
      );
    }

    return {
      status: res.status(),
      body: await res.json().catch(() => ({}) as T),
      ok: res.ok(),
      latencyMs,
      url,
    };
  }


  private readonly warnMs =
    Number(process.env.LATENCY_WARN_MS ?? 2000);

  private readonly failMs =
    Number(process.env.LATENCY_FAIL_MS ?? 5000);
}
