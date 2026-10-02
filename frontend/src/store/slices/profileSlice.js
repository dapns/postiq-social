import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_CONFIG } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (unusedArgument, { rejectWithValue }) => {
    try {
      return await httpClient.request(API_CONFIG.ENDPOINTS.PROFILE.ME);
    } catch (requestError) {
      return rejectWithValue(requestError.message || 'Unable to load your profile.');
    }
  },
  {
    condition: (unusedArgument, { getState }) => !getState().profile.isLoading,
  },
);

export const addProfileSource = createAsyncThunk(
  'profile/addSource',
  async ({ source, baseUrl }, { rejectWithValue }) => {
    try {
      return await httpClient.request(API_CONFIG.ENDPOINTS.PROFILE.ADD_SOURCE, {
        method: 'POST',
        body: JSON.stringify({ source, baseUrl }),
      });
    } catch (requestError) {
      return rejectWithValue(requestError.message || 'Unable to add this source.');
    }
  },
);

export const fetchMyPosts = createAsyncThunk(
  'profile/fetchMyPosts',
  async ({ pageNo = 1, pageSize = 20 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({ pageno: String(pageNo), pagesize: String(pageSize) });
      return await httpClient.request(`${API_CONFIG.ENDPOINTS.PROFILE.MY_POSTS}?${query}`);
    } catch (requestError) {
      return rejectWithValue(requestError.message || 'Unable to load your posts.');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    isAddingSource: false,
    addSourceError: null,
    addSourceSuccess: false,
    myPosts: null,
    isLoadingMyPosts: false,
    isLoadingMoreMyPosts: false,
    myPostsError: null,
    myPostsMoreError: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
      state.isAddingSource = false;
      state.addSourceError = null;
      state.addSourceSuccess = false;
      state.myPosts = null;
      state.isLoadingMyPosts = false;
      state.isLoadingMoreMyPosts = false;
      state.myPostsError = null;
      state.myPostsMoreError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Unable to load your profile.';
      })
      .addCase(addProfileSource.pending, (state) => {
        state.isAddingSource = true;
        state.addSourceError = null;
        state.addSourceSuccess = false;
      })
      .addCase(addProfileSource.fulfilled, (state) => {
        state.isAddingSource = false;
        state.addSourceSuccess = true;
      })
      .addCase(addProfileSource.rejected, (state, action) => {
        state.isAddingSource = false;
        state.addSourceError = action.payload || action.error.message || 'Unable to add this source.';
      })
      .addCase(fetchMyPosts.pending, (state, action) => {
        const pageNo = action.meta.arg?.pageNo ?? 1;
        state.isLoadingMyPosts = pageNo === 1;
        state.isLoadingMoreMyPosts = pageNo > 1;
        state.myPostsError = null;
        state.myPostsMoreError = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        const pageNo = action.meta.arg?.pageNo ?? 1;
        state.isLoadingMyPosts = false;
        state.isLoadingMoreMyPosts = false;
        if (pageNo > 1 && state.myPosts) {
          state.myPosts = {
            ...action.payload,
            data: [...(state.myPosts.data || []), ...(action.payload?.data || [])],
          };
        } else {
          state.myPosts = action.payload;
        }
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.isLoadingMyPosts = false;
        state.isLoadingMoreMyPosts = false;
        const error = action.payload || action.error.message || 'Unable to load your posts.';
        if ((action.meta.arg?.pageNo ?? 1) > 1) state.myPostsMoreError = error;
        else state.myPostsError = error;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;