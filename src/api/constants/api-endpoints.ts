/**
 * API Endpoints
 * ─────────────────────────────────────────────────────────────
 * Central location for all API endpoints.
 *
 * Purpose:
 *   - Avoid hardcoded URLs in tests.
 *   - Reuse endpoints across services and tests.
 *   - Simplify endpoint maintenance.
 */
export const ApiEndpoints = {

  auth: {

    login:
      '/auth/login',

    oauthToken:
      '/oauth/token',

    logout:
      '/auth/logout',

  },

  users: {

    profile:
      '/users/me',

    users:
      '/users',

  },

  products: {

    products:
      '/products',

    create:
      '/products',

  },
  goals: {

    products:
      '/products',

    create:
      '/goals',

  },

} as const;