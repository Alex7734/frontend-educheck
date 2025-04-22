import { TTokens } from '@/schemas/auth';
import { TUser } from '@/schemas/user';
import LocalStorage from '@/services/LocalStorage';
import { create } from 'zustand';

/**
 * This Zustand store is persisted with local storage.
 * The user and tokens are saved to and retrieved from local storage.
 */
interface AuthState {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  getUser: () => TUser | null;
  tokens: TTokens | null;
  setToken: (tokens: TTokens | null) => void;
  getRefreshToken: () => string | null;
  getTokens: () => TTokens | null;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>((set, getState) => ({
  user: null,
  setUser: (user) => {
    if (!user) {
      LocalStorage.removeItem('user');
      set({ user: null });
      return;
    } else {
      LocalStorage.setItem<TUser>('user', user);
    }

    set({ user });
  },
  getUser: () => {
    return LocalStorage.getItem<TUser>('user');
  },
  tokens: null,
  setToken: (tokens) => {
    const { accessToken, refreshToken } = tokens || {};

    if (!tokens) {
      LocalStorage.removeItem('tokens');
      set({ tokens: null });
      return;
    } else {
      const newTokens = {
        accessToken: accessToken || getState().tokens?.accessToken || '',
        refreshToken: refreshToken || getState().tokens?.refreshToken || ''
      };
      LocalStorage.setItem<TTokens>('tokens', newTokens);
    }

    // If the tokens are not provided, we don't want to override the existing tokens.
    // So we only update the tokens if they are provided.
    set((state) => ({
      tokens: {
        accessToken: tokens?.accessToken || state.tokens?.accessToken || '',
        refreshToken: tokens?.refreshToken || state.tokens?.refreshToken || ''
      }
    }));
  },
  getTokens: () => {
    return LocalStorage.getItem<TTokens>('tokens');
  },
  isAuthenticated: () => {
    const tokens = LocalStorage.getItem<string>('tokens');
    const user = LocalStorage.getItem<TUser>('user');
    return !!tokens && !!user;
  },
  getRefreshToken: () => {
    const stateTokens = getState().tokens;
    if (stateTokens) {
      return stateTokens.refreshToken;
    }

    const tokens = LocalStorage.getItem<TTokens>('tokens');
    return tokens?.refreshToken || null;
  },
}));

export default useAuthStore;
