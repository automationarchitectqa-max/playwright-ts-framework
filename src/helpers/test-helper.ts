/**
 * TestHelper
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides TestNG-style node/child test grouping.
 *
 * Node  = top-level test group (like a TestNG @Test class or a describe block)
 * Child = individual test within the node (like a @Test method)
 *
 * Also provides Allure-compatible annotation helpers.
 */

import { test, TestInfo } from '@playwright/test';

export interface TestNode {
  suite: string;
  feature?: string;
  story?: string;
  owner?: string;
  tags?: string[];
  issue?: string;
}

export class TestHelper {
  /**
   * Annotate a test with node/child metadata for Allure and HTML reporting.
   *
   * Usage inside a test:
   *   TestHelper.annotate(testInfo, {
   *     suite: 'User Management',
   *     feature: 'User CRUD',
   *     story: 'Create User',
   *     owner: 'qa-team',
   *     tags: ['@smoke', '@regression'],
   *   });
   */
  static annotate(testInfo: TestInfo, meta: TestNode): void {
    testInfo.annotations.push({ type: 'suite', description: meta.suite });
    if (meta.feature)
      testInfo.annotations.push({ type: 'feature', description: meta.feature });
    if (meta.story)
      testInfo.annotations.push({ type: 'story', description: meta.story });
    if (meta.owner)
      testInfo.annotations.push({ type: 'owner', description: meta.owner });
    if (meta.issue)
      testInfo.annotations.push({ type: 'issue', description: meta.issue });
    if (meta.tags?.length) {
      meta.tags.forEach((tag) =>
        testInfo.annotations.push({ type: 'tag', description: tag })
      );
    }
  }

  /**
   * Mark a test as a child under a parent suite node.
   * This creates a clear hierarchy in Allure: Suite > Feature > Story > Test
   */
  static setParentSuite(testInfo: TestInfo, parentSuite: string): void {
    testInfo.annotations.push({ type: 'parentSuite', description: parentSuite });
  }

  /**
   * Add a custom step description (shows in reports as a named step)
   */
  static async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return test.step(name, fn);
  }

  /**
   * Attach extra data to a test report (JSON payloads, HTML snippets, etc.)
   */
  static async attachJson(
    testInfo: TestInfo,
    name: string,
    data: unknown
  ): Promise<void> {
    await testInfo.attach(name, {
      body: JSON.stringify(data, null, 2),
      contentType: 'application/json',
    });
  }

  static async attachText(
    testInfo: TestInfo,
    name: string,
    content: string
  ): Promise<void> {
    await testInfo.attach(name, {
      body: content,
      contentType: 'text/plain',
    });
  }

  static async attachScreenshot(
    testInfo: TestInfo,
    name: string,
    screenshot: Buffer
  ): Promise<void> {
    await testInfo.attach(name, {
      body: screenshot,
      contentType: 'image/png',
    });
  }
}
