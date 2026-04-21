import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    // Skip redirect for all auth-related endpoints
    const isAuthRequest = url.includes('/auth/login') || 
                         url.includes('/auth/graduate/login') ||
                         url.includes('/auth/graduate/register') ||
                         url.includes('/auth/admin/login') ||
                         url.includes('/auth/graduate/verify-email');

    if (error.response?.status === 401 && !isAuthRequest) {
      console.warn('Unauthorized request:', url);
      // We don't redirect here anymore because AuthContext handles it via getCurrentUser failure
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
