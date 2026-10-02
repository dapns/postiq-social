import store from '@/store/store';
import { requestFinished, requestStarted } from '@/store/slices/apiLoadingSlice';

export async function trackApiRequest(callback) {
  store.dispatch(requestStarted());
  try {
    return await callback();
  } finally {
    store.dispatch(requestFinished());
  }
}

export function apiFetch(...args) {
  return trackApiRequest(() => fetch(...args));
}