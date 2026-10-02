import { createSlice } from '@reduxjs/toolkit';

const apiLoadingSlice = createSlice({
  name: 'apiLoading',
  initialState: { requestCount: 0 },
  reducers: {
    requestStarted(state) {
      state.requestCount += 1;
    },
    requestFinished(state) {
      state.requestCount = Math.max(0, state.requestCount - 1);
    },
  },
});

export const { requestStarted, requestFinished } = apiLoadingSlice.actions;
export default apiLoadingSlice.reducer;