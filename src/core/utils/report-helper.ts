import * as allure from 'allure-js-commons';

/**
 * ReportHelper
 * ─────────────────────────────────────────────────────────────────────────────
 * Wrapper around Allure steps.
 *
 * Purpose:
 *   Add business-level reporting to Allure without
 *   polluting test code with direct Allure APIs.
 *
 * Example:
 *
 *   await ReportHelper.step(
 *     'Load expected test data'
 *   );
 *
 *   await ReportHelper.step(
 *     'Validate Anime Status API Response',
 *     async () => {
 *       await ApiAssertions.assertStatus(response, 200);
 *     }
 *   );
 *
 * Allure Output:
 *
 *   ✓ Load expected test data
 *   ✓ Validate Anime Status API Response
 *       ✓ Validate HTTP Status = 200
 *
 */
export class ReportHelper {

  /**
   * Create an Allure step.
   *
   * @param name
   *        Step name displayed in Allure report.
   *
   * @param action
   *        Optional action to execute inside the step.
   *        Supports nested assertion reporting.
   */
  static async step(
    name: string,
    action?: () => Promise<void> | void
  ): Promise<void> {

    await allure.step(
      name,
      async () => {

        if (action) {
          await action();
        }

      }
    );
  }
}