/**
 * ContractAssertions
 * ─────────────────────────────────────────────────────────────
 * Purpose:
 *   Validate API responses against JSON contracts.
 *
 * Responsibilities:
 *   • Load JSON schema files
 *   • Validate API responses
 *   • Fail tests when contracts are broken
 *
 * Example:
 *
 * await ContractAssertions.validate(
 *   response.body,
 *   Contracts.goalService.createGoal
 * );
 */

import fs from 'fs';
import Ajv from 'ajv';

export class ContractAssertions {

  /**
   * Validate API response against schema.
   *
   * Purpose:
   *   Ensures API response structure
   *   matches the agreed contract.
   *
   * @param response
   *        Actual API response body.
   *
   * @param schemaPath
   *        JSON schema file path.
   */
  static async validate(
    response: unknown,
    schemaPath: string
  ): Promise<void> {

    const schema =
      JSON.parse(
        fs.readFileSync(
          schemaPath,
          'utf8'
        )
      );

    const ajv =
      new Ajv();

    const validator =
      ajv.compile(
        schema
      );

    const valid =
      validator(
        response
      );

    if (!valid) {

      throw new Error(
        `Contract validation failed:\n${JSON.stringify(
          validator.errors,
          null,
          2
        )}`
      );

    }

  }

}