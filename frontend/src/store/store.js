/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiLoadingReducer from './slices/apiLoadingSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apiLoading: apiLoadingReducer,
    profile: profileReducer,
  },
});

export default store;
