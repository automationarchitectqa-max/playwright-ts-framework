/**
 * ApiClient
 * ─────────────────────────────────────────────────────────────
 * Core HTTP client wrapping Playwright's APIRequestContext.
 *
 * Features:
 *  • Type-safe response deserialization
 *  • Automatic request/response logging
 *  • Curl generation for debugging
 *  • Bearer authentication support
 *  • OAuth authentication support
 *  • Latency monitoring
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

  constructor(
    request: APIRequestContext,
    baseUrl: string
  ) {

    this.request = request;
    this.baseUrl = baseUrl;

    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    console.log(
      `[ApiClient] Initialized with baseUrl: ${baseUrl}`
    );
  }

  /**
   * Set Bearer authentication.
   *
   * Example:
   * Authorization: Bearer eyJ...
   */
  setBearerToken(
    token: string
  ): void {

    this.headers['Authorization'] =
      `Bearer ${token}`;

  }

  /**
   * Set OAuth authentication.
   *
   * Example:
   * Authorization: OAuth eyJ...
   */
  setOAuthToken(
    token: string
  ): void {

    this.headers['Authorization'] =
      `OAuth ${token}`;

  }

  /**
   * Remove authentication header.
   */
  clearAuthentication(): void {

    delete this.headers['Authorization'];

  }

  /**
   * Add or override header.
   */
  setHeader(
    name: string,
    value: string
  ): void {

    this.headers[name] =
      value;

  }

  /**
   * Remove header.
   */
  removeHeader(
    name: string
  ): void {

    delete this.headers[name];

  }

  /**
   * HTTP GET request.
   */
  async get<T>(
    endpoint: string
  ): Promise<ApiResponse<T>> {

    return this.send<T>(
      'get',
      endpoint
    );

  }

  /**
   * HTTP GET with automatic success validation.
   */
  async getAndValidate<T>(
    endpoint: string
  ): Promise<ApiResponse<T>> {

    const response =
      await this.get<T>(
        endpoint
      );

    await ApiAssertions.assertStatus(
      response,
      200
    );

    await ApiAssertions.assertOk(
      response
    );

    return response;
  }

  /**
   * HTTP POST request.
   */
  async post<T>(
    endpoint: string,
    body: object
  ): Promise<ApiResponse<T>> {

    return this.send<T>(
      'post',
      endpoint,
      body
    );

  }

  /**
   * HTTP PUT request.
   */
  async put<T>(
    endpoint: string,
    body: object
  ): Promise<ApiResponse<T>> {

    return this.send<T>(
      'put',
      endpoint,
      body
    );

  }

  /**
   * HTTP PATCH request.
   */
  async patch<T>(
    endpoint: string,
    body: object
  ): Promise<ApiResponse<T>> {

    return this.send<T>(
      'patch',
      endpoint,
      body
    );

  }

  /**
   * HTTP DELETE request.
   */
  async delete<T>(
    endpoint: string
  ): Promise<ApiResponse<T>> {

    return this.send<T>(
      'delete',
      endpoint
    );

  }

  /**
   * Generic request executor.
   */
  private async send<T>(
    method:
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete',
    endpoint: string,
    body?: object
  ): Promise<ApiResponse<T>> {

    const url =
      `${this.baseUrl}${endpoint}`;

    CurlLogger.log(
      method,
      url,
      this.headers,
      body
    );

    console.log(
      `[ApiClient] Making ${method.toUpperCase()} request to: ${url}`
    );

    const startTime =
      Date.now();

    const res =
      await this.request[method](
        url,
        {
          headers:
            this.headers,
          data:
            body,
        }
      );

    const responseText =
      await res.text();

    console.log(
      'STATUS:',
      res.status()
    );

    console.log(
      'RESPONSE:',
      responseText
    );

    const latencyMs =
      Date.now() - startTime;

    const warnMs =
      Number(
        process.env.LATENCY_WARN_MS ?? 2000
      );

    if (latencyMs > warnMs) {

      console.warn(
        `[Latency Warning] ${method.toUpperCase()} ${url} took ${latencyMs}ms (threshold: ${warnMs}ms)`
      );

    }

    let responseBody: T;

    try {

      responseBody =
        JSON.parse(
          responseText
        ) as T;

    } catch {

      responseBody =
        {} as T;

    }

    return {
      status:
        res.status(),

      body:
        responseBody,

      ok:
        res.ok(),

      latencyMs,

      url,
    };
  }
}