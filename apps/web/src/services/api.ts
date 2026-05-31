import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        throw error;
      }

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`,
          { refreshToken }
        );

        const { user } = useAuthStore.getState();

        useAuthStore.getState().setAuth({
          user: user!,
          accessToken: refreshResponse.data.accessToken,
          refreshToken: refreshResponse.data.refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        throw refreshError;
      }
    }

    throw error;
  }
);

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  stocks: {
    all: '/stocks',
    overview: '/stocks/overview',
    bySymbol: (symbol: string) => `/stocks/${symbol}`,
  },
  watchlist: '/watchlist',
  portfolio: '/portfolio',
  alerts: '/alerts',
  analytics: '/analytics',
  sentiment: '/analytics/sentiment',
  profile: '/users/profile',
};
