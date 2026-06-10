import { ApiClient } from '../client/api-client';
import { ApiEndpoints }from '../constants/api-endpoints';

/**
 * Authentication Service
 * ─────────────────────────────────────────────────────────────
 * Purpose:
 *   - Centralize authentication logic.
 *   - Cache tokens to avoid repeated login calls.
 *   - Automatically refresh expired tokens.
 *   - Support Bearer and OAuth authentication.
 *
 * Usage:
 *
 * const authService =
 *   new AuthService(apiClient);
 *
 * await authService.loginWithBearer(
 *   '/auth/login',
 *   process.env.API_USERNAME!,
 *   process.env.API_PASSWORD!
 * );
 *
 * const response =
 *   await apiClient.get('/users/me');
 */
export class AuthService {

  /**
   * Cached Bearer token.
   */
  private static bearerToken?: string;

  /**
   * Bearer token expiry timestamp.
   */
  private static bearerTokenExpiry?: number;

  /**
   * Cached OAuth token.
   */
  private static oauthToken?: string;

  /**
   * OAuth token expiry timestamp.
   */
  private static oauthTokenExpiry?: number;

  constructor(
    private readonly apiClient: ApiClient
  ) { }

  /**
   * Login using Bearer authentication.
   *
   * Expected Response:
   *
   * {
   *   "access_token": "abc123",
   *   "expires_in": 3600
   * }
   * @returns
   *        Access token.
   */
  async loginWithBearer(
  ): Promise<string> {

    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    const endpoint = ApiEndpoints.auth.login;
    if (!username || !password) {
      throw new Error(
        'API_USERNAME or API_PASSWORD not configured'
      );
    }
    
    const now = Date.now();

    if (
      AuthService.bearerToken &&
      AuthService.bearerTokenExpiry &&
      now < AuthService.bearerTokenExpiry
    ) {

      this.apiClient.setBearerToken(
        AuthService.bearerToken
      );

      return AuthService.bearerToken;
    }

    const response =
      await this.apiClient.post<{
        access_token: string;
        expires_in?: number;
      }>(
        endpoint,
        {
          username,
          password
        }
      );

    const token =
      response.body.access_token;

    const expiresIn =
      response.body.expires_in ?? 3600;

    AuthService.bearerToken =
      token;

    AuthService.bearerTokenExpiry =
      Date.now() +
      ((expiresIn - 60) * 1000);

    this.apiClient.setBearerToken(
      token
    );

    return token;
  }

  /**
   * Login using OAuth authentication.
   *
   * Expected Response:
   *
   * {
   *   "access_token": "abc123",
   *   "expires_in": 3600
   * }
   *
   * @returns
   *        Access token.
   */
  async loginWithOAuth(
    ): Promise<string> {

    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    const endpoint = ApiEndpoints.auth.oauthToken;
    
    if (!username || !password) {
      throw new Error(
        'API_USERNAME or API_PASSWORD not configured'
      );
    }
    const now =
      Date.now();

    if (
      AuthService.oauthToken &&
      AuthService.oauthTokenExpiry &&
      now < AuthService.oauthTokenExpiry
    ) {

      this.apiClient.setOAuthToken(
        AuthService.oauthToken
      );

      return AuthService.oauthToken;
    }

    const response =
      await this.apiClient.post<{
        access_token: string;
        expires_in?: number;
      }>(
        endpoint,
        {
          username,
          password,
          grant_type: 'password'
        }
      );

    const token =
      response.body.access_token;

    const expiresIn =
      response.body.expires_in ?? 3600;

    AuthService.oauthToken =
      token;

    AuthService.oauthTokenExpiry =
      Date.now() +
      ((expiresIn - 60) * 1000);

    this.apiClient.setOAuthToken(
      token
    );

    return token;
  }

  /**
   * Clear authentication.
   */
  clearAuthentication(): void {

    this.apiClient.clearAuthentication();

  }

  /**
   * Clear cached tokens.
   *
   * Useful for:
   *   - Logout testing
   *   - Negative authentication tests
   */
  static clearCache(): void {

    AuthService.bearerToken =
      undefined;

    AuthService.bearerTokenExpiry =
      undefined;

    AuthService.oauthToken =
      undefined;

    AuthService.oauthTokenExpiry =
      undefined;
  }
}