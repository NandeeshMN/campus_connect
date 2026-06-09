/**
 * Dedicated Axios instance for Admin API calls.
 * This instance does NOT have the student token refresh interceptor,
 * preventing infinite retry loops when the admin is not logged in.
 */
import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send adminToken cookie
});

// Inject adminToken from localStorage if available
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, just reject — no refresh loop
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 and we're not already on the admin login page, clear the token
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Only redirect if not already on the login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
