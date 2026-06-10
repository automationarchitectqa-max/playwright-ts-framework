/**
 * Contracts
 * ─────────────────────────────────────────────────────────────
 * Purpose:
 *   Central location for all JSON contracts.
 *
 * Responsibilities:
 *   • Avoid hardcoded schema paths
 *   • Reuse contracts across tests
 *   • Simplify maintenance
 */
export const Contracts = {

  goalService: {

    createGoal:
      'test-data/contracts/goal-service/create-goal.schema.json',

    getGoal:
      'test-data/contracts/goal-service/get-goal.schema.json',

  },

  rewardService: {

    createReward:
      'test-data/contracts/reward-service/create-reward.schema.json',

  },

};