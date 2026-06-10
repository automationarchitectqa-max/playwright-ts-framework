/**
 * DataProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads YAML test data based on:
 *
 * - Environment (dev/staging/prod) from ENV variable
 * - Test type (api/ui) from testInfo.file
 *
 * Folder Structure:
 *
 * src/test-data/
 * ├── api
 * │   ├── dev
 * │   ├── staging
 * │   └── prod
 * │
 * └── ui
 *     ├── dev
 *     ├── staging
 *     └── prod
 *
 * Usage:
 *
 * const expected =
 *   DataProvider.get<Partial<AnimeStatusResponse>>(
 *     testInfo,
 *     'anime-status.yaml',
 *     'getAnimeStatus'
 *   );
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { TestInfo } from '@playwright/test';

export class DataProvider {

  private static readonly cache =
    new Map<string, unknown>();

  static get<T>(
    testInfo: TestInfo,
    fileName: string,
    testName: string
  ): T {

    const env =
      process.env.ENV || 'dev';

    const normalizedPath =
      testInfo.file.replace(/\\/g, '/');

    const type =
      normalizedPath.includes('/api/')
        ? 'api'
        : 'ui';

    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      type,
      env,
      fileName
    );

    let data =
      this.cache.get(filePath);

    if (!data) {

      if (!fs.existsSync(filePath)) {

        throw new Error(
          `Test data file not found: ${filePath}`
        );
      }

      data = yaml.load(
        fs.readFileSync(
          filePath,
          'utf8'
        )
      );

      this.cache.set(
        filePath,
        data
      );
    }

    const testData =
      (data as Record<string, T>)[testName];

    if (!testData) {

      throw new Error(
        `Test data key '${testName}' not found in ${fileName}`
      );
    }

    return testData;
  }

  /**
 * Load multiple test scenarios from YAML.
 *
 * Purpose:
 *   Provides Playwright data-driven testing
 *   similar to TestNG DataProvider.
 *
 * YAML Example:
 *
 * createProduct:
 *
 *   - name: Create MacBook Product
 *     request:
 *       ...
 *     expected:
 *       ...
 *
 *   - name: Create Dell Product
 *     request:
 *       ...
 *     expected:
 *       ...
 *
 * Usage:
 *
 * const scenarios =
 *   DataProvider.getScenarios<any>(
 *     'products.yaml',
 *     'createProduct'
 *   );
 *
 * scenarios.forEach(
 *   (scenario) => {
 *
 *     test(
 *       scenario.name,
 *       async () => {
 *         ...
 *       }
 *     );
 *
 *   }
 * );
 *
 * @param fileName
 *        YAML file name.
 *
 * @param key
 *        Root key inside YAML.
 *
 * @param area
 *        Test data area.
 *        Supported values:
 *        - api
 *        - ui
 *
 * @returns
 *        Array of test scenarios.
 */
  static getScenarios<T>(
    fileName: string,
    key: string,
    area: 'api' | 'ui' = 'api'
  ): T[] {

    const env =
      process.env.ENV || 'dev';

    const filePath =
      path.join(
        process.cwd(),
        'test-data',
        area,
        env,
        fileName
      );

    if (!fs.existsSync(filePath)) {

      throw new Error(
        `Test data file not found: ${filePath}`
      );

    }

    const yamlContent =
      fs.readFileSync(
        filePath,
        'utf8'
      );

    const yamlData =
      yaml.load(
        yamlContent
      ) as Record<string, unknown>;

    const scenarios =
      yamlData[key];

    if (!scenarios) {

      throw new Error(
        `Key '${key}' not found in ${fileName}`
      );

    }

    if (!Array.isArray(scenarios)) {

      throw new Error(
        `Key '${key}' in ${fileName} must contain a YAML array`
      );

    }

    return scenarios as T[];
  }
}