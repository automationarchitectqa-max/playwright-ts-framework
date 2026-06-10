import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific config
const ENV = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `src/core/config/env/.env.${ENV}`) });
dotenv.config({ path: path.resolve(__dirname, `src/core/config/env/.env`) });

const WORKERS = parseInt(process.env.WORKERS || '4');
const TAG = process.env.TAG || '';
const BASE_URL = process.env.BASE_URL!;
const API_BASE_URL = process.env.API_BASE_URL!;

// Absolute paths for reporters
const ALLURE_RESULTS_DIR = path.resolve(
  'reports',
  'allure-results'
);
export default defineConfig({
  // ─── Test Discovery ───────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  outputDir: './reports/test-results',

  // ─── Execution ────────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: WORKERS,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // ─── Grep (tag filtering) ─────────────────────────────────────────────────
  ...(TAG ? { grep: new RegExp(`@${TAG}`) } : {}),

  // ─── Reporters ────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', {
      resultsDir: ALLURE_RESULTS_DIR,   
      detail: false,
      suiteTitle: false,
    }]
  ],

  // ─── Global Setup ─────────────────────────────────────────────────────────
  globalSetup: './src/core/config/global-setup.ts',
  globalTeardown: './src/core/config/global-teardown.ts',

  // ─── Shared Fixture / Use ──────────────────────────────────────────────────
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: process.env.HEADLESS !== 'false',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      'x-framework': 'pw-ts-framework',
    },
  },

  // ─── Projects ─────────────────────────────────────────────────────────────
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
      },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
      },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      testDir: './tests/ui',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
