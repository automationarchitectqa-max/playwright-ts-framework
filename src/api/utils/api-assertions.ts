/**
 * ApiAssertions
 * ─────────────────────────────────────────────────────────────────────────────
 * Common API assertion helpers.
 *
 * Purpose:
 *   Keep test code clean and reusable.
 *
 * Example:
 *
 *   ApiAssertions.assertStatus(response, 200);
 *   ApiAssertions.assertOk(response);
 *   ApiAssertions.assertBodyNotEmpty(response);
 */

/**
 * ApiAssertions
 * ─────────────────────────────────────────────────────────────────────────────
 * Common API assertion helpers with Allure reporting.
 */

import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ApiResponse } from '../../api/client/api-client';

export class ApiAssertions {

  /**
   * Validate HTTP status code
   */
  static async assertStatus(
    response: ApiResponse,
    expectedStatus: number
  ): Promise<void> {

    await allure.step(
      `Validate HTTP Status = ${expectedStatus}`,
      async () => {
        expect(response.status)
          .toBe(expectedStatus);
      }
    );
  }

  /**
 * Validate multiple fields in one call.
 *
 * Example:
 *
 * await ApiAssertions.assertFields(
 *   response.body,
 *   {
 *     code: 200,
 *     status: true
 *   }
 * );
 *
 * Equivalent to:
 *
 * await ApiAssertions.assertValue(
 *   response.body.code,
 *   200,
 *   'Validate code'
 * );
 *
 * await ApiAssertions.assertValue(
 *   response.body.status,
 *   true,
 *   'Validate status'
 * );
 *
 * Notes:
 * - Only validates fields present in the expected object.
 * - Useful when expected values come from YAML/CSV.
 * - For special validations such as contains(), regex(),
 *   not-null checks, etc., use dedicated assertion methods.
 */
static async assertFields<T>(
  actual: T,
  expected: Partial<T>
): Promise<void> {

  for (const [key, value] of Object.entries(expected)) {

    await this.assertValue(
      (actual as Record<string, unknown>)[key],
      value,
      `Validate ${key}`
    );
  }
}

  /**
   * Validate successful response (2xx)
   */
  static async assertOk(
    response: ApiResponse
  ): Promise<void> {

    await allure.step(
      'Validate Response Is Successful',
      async () => {
        expect(response.ok)
          .toBeTruthy();
      }
    );
  }

  /**
   * Validate response body exists
   */
  static async assertBodyNotEmpty(
    response: ApiResponse
  ): Promise<void> {

    await allure.step(
      'Validate Response Body Is Not Empty',
      async () => {
        expect(response.body)
          .toBeDefined();

        expect(response.body)
          .not.toBeNull();
      }
    );
  }

  /**
   * Validate body contains a property
   */
  static async assertBodyHasKey(
    response: ApiResponse,
    key: string
  ): Promise<void> {

    await allure.step(
      `Validate Response Contains Key '${key}'`,
      async () => {
        expect(response.body)
          .toHaveProperty(key);
      }
    );
  }

  /**
   * Validate specific field value
   */
  static async assertBodyField<T>(
    response: ApiResponse,
    key: string,
    expected: T
  ): Promise<void> {

    await allure.step(
      `Validate Field '${key}' Equals '${String(expected)}'`,
      async () => {
        expect(
          (response.body as Record<string, unknown>)[key]
        ).toEqual(expected);
      }
    );
  }

  /**
   * Validate partial response body
   */
  static async assertBodyContains(
    response: ApiResponse,
    expected: Record<string, unknown>
  ): Promise<void> {

    await allure.step(
      'Validate Partial Response Body',
      async () => {
        expect(response.body)
          .toMatchObject(expected);
      }
    );
  }

  /**
   * Validate minimum array size
   */
  static async assertArrayMinLength(
    response: ApiResponse<unknown[]>,
    minLength: number
  ): Promise<void> {

    await allure.step(
      `Validate Array Size >= ${minLength}`,
      async () => {
        expect(response.body.length)
          .toBeGreaterThanOrEqual(minLength);
      }
    );
  }

  static async assertValue<T>(
  actual: T,
  expected: T,
  message: string
): Promise<void> {

  await allure.step(message, async () => {
    expect(actual).toBe(expected);
  });
}

static async assertTruthy(
  actual: unknown,
  message: string
): Promise<void> {

  await allure.step(message, async () => {
    expect(actual).toBeTruthy();
  });
}

static async assertContains(
  actual: string,
  expected: string,
  message: string
): Promise<void> {

  await allure.step(message, async () => {
    expect(actual).toContain(expected);
  });
}
}