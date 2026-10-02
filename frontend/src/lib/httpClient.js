import store from '@/store/store';
import { API_CONFIG, getApiUrl } from '@/config/apiConfig';
import { refreshTokenSuccess, logoutSuccess } from '@/store/slices/authSlice';
import { trackApiRequest } from '@/lib/apiLoading';

async function fetchWithAuth(endpoint, opts = {}) {
  const url = getApiUrl(endpoint);

  const state = store.getState();
  let accessToken = state.auth.accessToken;

  const headers = Object.assign({}, opts.headers || {});
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  const res = await fetch(url, Object.assign({}, opts, { headers }));

  if (res.status !== 401) return res;

  // On 401, attempt refresh using refreshToken stored in sessionStorage
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    store.dispatch(logoutSuccess());
    throw new Error('Unauthorized');
  }

  const refreshRes = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    store.dispatch(logoutSuccess());
    throw new Error('Token refresh failed');
  }

  const tokens = await refreshRes.json();
  store.dispatch(refreshTokenSuccess(tokens));
  try { if (tokens.refreshToken) sessionStorage.setItem('refreshToken', tokens.refreshToken); } catch {}

  // Retry original request with new access token
  const newHeaders = Object.assign({}, opts.headers || {});
  newHeaders['Authorization'] = `Bearer ${tokens.accessToken}`;
  newHeaders['Content-Type'] = newHeaders['Content-Type'] || 'application/json';

  const retryRes = await fetch(url, Object.assign({}, opts, { headers: newHeaders }));
  return retryRes;
}

async function request(endpoint, opts = {}) {
  return trackApiRequest(async () => {
    const res = await fetchWithAuth(endpoint, opts);
    if (!res.ok) {
      let errorData = null;
      try { errorData = await res.json(); } catch {}
      const message = errorData?.detail || errorData?.message || res.statusText || 'Request failed';
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }
    try {
      return await res.json();
    } catch {
      return null;
    }
  });
}

export default { request };
