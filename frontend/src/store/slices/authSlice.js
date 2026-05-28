/**
 * Redux Slice for Authentication
 * Manages auth state and token storage
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.isLoading = false;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Register actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      // User will be redirected to login after registration
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout actions
    logoutStart: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Set user profile
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Forgot password actions
    forgotPasswordStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    forgotPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Reset password actions
    resetPasswordStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    resetPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Token refresh
    refreshTokenSuccess: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  setUser,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearError,
  refreshTokenSuccess,
} = authSlice.actions;

export default authSlice.reducer;
