import axios from 'axios';
import { tokensSchema, type TTokens } from '@/schemas/auth';
import LocalStorage from '@/services/LocalStorage';
import useAuthStore from '@/store/useAuthStore';
import { ApiStatus } from '@/localConstants/apiStatus';
import { BASE_URL } from './endpoints';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  (config) => {
    const tokens = LocalStorage.getItem<string>('tokens');
    if (tokens) {
      try {
        const parsedTokens = tokensSchema.parse(JSON.parse(tokens));
        config.headers.Authorization = `Bearer ${parsedTokens.accessToken}`;
      } catch (error) {
        console.error('Invalid tokens:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === ApiStatus.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const tokens = LocalStorage.getItem<TTokens>('tokens');
      const refreshToken = tokens?.refreshToken;

      if (refreshToken) {
        try {
          const response = await API.post('/auth/refresh-token', {
            refreshToken
          });
          const newTokens = tokensSchema.parse(response.data);

          useAuthStore.getState().setToken(newTokens);
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

          return API(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setToken(null);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
