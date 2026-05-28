/**
 * API Configuration
 * Update the API_BASE_URL to match your backend server
 */

export const API_CONFIG = {
  // Change this to your backend API URL
  // e.g., 'http://localhost:5255' for local .NET backend
  // e.g., 'https://api.postiq.com' for production
  API_BASE_URL: 'http://localhost:5013',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/revoke',
      LOGOUT_ALL: '/api/auth/logout-all',
      GET_PROFILE: '/api/auth/me',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      CONFIRM_EMAIL: '/api/auth/confirm-email',
      RESEND_CONFIRMATION: '/api/auth/resend-confirmation',
      CHANGE_PASSWORD: '/api/auth/password',
      SETUP_2FA: '/api/auth/two-factor/setup',
      ENABLE_2FA: '/api/auth/two-factor/enable',
      DISABLE_2FA: '/api/auth/two-factor/disable',
      LOGIN_TOTP: '/api/auth/login/totp',
      REQUEST_PHONE: '/api/auth/phone/request',
      CONFIRM_PHONE: '/api/auth/phone/confirm',
      EXTERNAL_PROVIDERS: '/api/auth/external/providers',
    },
  },
};

/**
 * Get full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};
