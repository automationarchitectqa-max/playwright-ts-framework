/**
 * Goal Service Contract Tests
 * ─────────────────────────────────────────────────────────────
 * Purpose:
 *   Validate Goal Service API contracts.
 *
 * Responsibilities:
 *   • Validate HTTP status
 *   • Validate response schema
 *   • Detect breaking API changes
 *
 * Examples:
 *   • Missing fields
 *   • Renamed fields
 *   • Data type changes
 */

import { test }
  from '../../src/core/fixtures';

import { ApiAssertions }
  from '../../src/api/utils/api-assertions';

import { ContractAssertions }
  from '../../src/api/utils/contract-assertions';

import { Contracts }
  from '../../src/api/constants/contracts';

test(
  'POST Create Goal Contract',

  async ({
    apiClient
  }) => {

    const request = {

      title: 'Walk 10k',

      targetSteps: 10000,

    };

    const response =
      await apiClient.post(
        '/goals',
        request
      );

    await ApiAssertions.assertStatus(
      response,
      200
    );

    await ApiAssertions.assertOk(
      response
    );

    await ContractAssertions.validate(
      response.body,
      Contracts.goalService.createGoal
    );

  }
);