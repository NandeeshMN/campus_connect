import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true, // Send cookies when cross-domain requests
});

// Interceptor to add access token to requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh on 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/login' && originalRequest.url !== '/refresh') {
      originalRequest._retry = true;
      try {
        const { data } = await authApi.post('/refresh');
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear everything
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authApi.post('/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authApi.post('/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await authApi.get('/me');
  return response.data;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
