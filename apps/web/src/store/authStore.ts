import { create } from 'zustand';

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
};

const storageKey = 'kite-auth';

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as {
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  } catch {
    return null;
  }
};

const storedAuth =
  typeof window !== 'undefined' ? loadStoredAuth() : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: storedAuth?.user ?? null,
  accessToken: storedAuth?.accessToken ?? null,
  refreshToken: storedAuth?.refreshToken ?? null,
  isAuthenticated: Boolean(storedAuth?.accessToken),

  setAuth: ({ user, accessToken, refreshToken }) => {
    const authData = { user, accessToken, refreshToken };
    localStorage.setItem(storageKey, JSON.stringify(authData));
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem(storageKey);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));