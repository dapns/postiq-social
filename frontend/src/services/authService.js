/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { API_CONFIG, getApiUrl } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';

class AuthService {
  /**
   * Register a new user
   */
  static async register(data) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.detail || 'Registration failed',
        };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(email, password) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.detail || 'Login failed',
        };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) throw new Error('Refresh token required');

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke a single refresh token
   */
  static async logout(refreshToken) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke all tokens for user
   */
  static async logoutAll(accessToken) {
    try {
      return await httpClient.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT_ALL, { method: 'POST' });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    try {
      return await httpClient.request(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, { method: 'GET' });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.detail || 'Failed to send reset email',
        };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(email, token, newPassword) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.detail || 'Failed to reset password',
        };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm email address
   */
  static async confirmEmail(email, token) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.CONFIRM_EMAIL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        throw new Error('Email confirmation failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend confirmation email
   */
  static async resendConfirmation(email) {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESEND_CONFIRMATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend confirmation');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword, newPassword) {
    try {
      return await httpClient.request(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
