/**
 * Custom Hook for Authentication
 * Provides easy access to auth state and actions
 */

import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  setUser,
  clearError,
  authInitializationComplete,
} from '@/store/slices/authSlice';
import AuthService from '@/services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken, refreshToken, isLoading, error, isAuthenticated, isAuthInitialized } = useSelector(
    (state) => state.auth
  );

  const register = async (email, password, firstName, middleName, lastName, phoneNumber, referralCode) => {
    dispatch(registerStart());
    try {
      const response = await AuthService.register({
        email,
        password,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        referralCode,
      });
      dispatch(registerSuccess());
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      throw err;
    }
  };

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const response = await AuthService.login(email, password);
      dispatch(loginSuccess(response));

      // Fetch and set user profile after successful login
      try {
        const profile = await AuthService.getProfile();
        dispatch(setUser(profile));
      } catch (profileErr) {
        console.warn('Failed to fetch user profile after login', profileErr);
      }
      // Persist refresh token in sessionStorage as a fallback for refresh on reload
      try {
        if (response.refreshToken) sessionStorage.setItem('refreshToken', response.refreshToken);
      } catch (e) {
        console.warn('Could not persist refresh token in sessionStorage', e);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw err;
    }
  };

  const logout = async () => {
    dispatch(logoutStart());
    try {
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      dispatch(logoutSuccess());
      try { sessionStorage.removeItem('refreshToken'); } catch {}
    } catch (err) {
      dispatch(logoutFailure(err.message));
      throw err;
    }
  };

  const logoutAll = async () => {
    dispatch(logoutStart());
    try {
      await AuthService.logoutAll();
      dispatch(logoutSuccess());
    } catch (err) {
      dispatch(logoutFailure(err.message));
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    dispatch(forgotPasswordStart());
    try {
      const response = await AuthService.forgotPassword(email);
      dispatch(forgotPasswordSuccess());
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email';
      dispatch(forgotPasswordFailure(errorMessage));
      throw err;
    }
  };

  const resetPassword = async (email, token, newPassword) => {
    dispatch(resetPasswordStart());
    try {
      const response = await AuthService.resetPassword(email, token, newPassword);
      dispatch(resetPasswordSuccess());
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      dispatch(resetPasswordFailure(errorMessage));
      throw err;
    }
  };

  const handleSetUser = (userData) => {
    dispatch(setUser(userData));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    isAuthInitialized,
    register,
    login,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    setUser: handleSetUser,
    clearError: handleClearError,
  };
};
let authInitializationPromise;

export const initializeAuth = (dispatch) => {
  if (!authInitializationPromise) {
    authInitializationPromise = (async () => {
      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) return;

        const response = await AuthService.refreshToken(refreshToken);
        dispatch(loginSuccess(response));
        try {
          if (response.refreshToken) sessionStorage.setItem('refreshToken', response.refreshToken);
        } catch {}
        try {
          const profile = await AuthService.getProfile();
          dispatch(setUser(profile));
        } catch (profileErr) {
          console.warn('Failed to fetch profile during init', profileErr);
        }
      } catch {
        try { sessionStorage.removeItem('refreshToken'); } catch {}
      } finally {
        dispatch(authInitializationComplete());
      }
    })();
  }

  return authInitializationPromise;
};
