import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// How many times to retry if server is sleeping
const MAX_RETRIES = 5;

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // --- Retry if server is sleeping (cold start) ---
    // Only retry for network errors or 502/503/504 (gateway timeout)
    // These errors mean the server hasn't responded, not that our request was wrong
    const serverSleeping = !error.response || status === 502 || status === 503 || status === 504;

    // Track how many times we've retried this request
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (serverSleeping && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount++;
      console.log('Server waking up... retry ' + originalRequest._retryCount + '/' + MAX_RETRIES);
      return api(originalRequest);
    }

    // --- Refresh token if expired ---
    if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        localStorage.setItem('accessToken', res.data.accessToken);
        api.defaults.headers.common.Authorization = 'Bearer ' + res.data.accessToken;
        originalRequest.headers.Authorization = 'Bearer ' + res.data.accessToken;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
