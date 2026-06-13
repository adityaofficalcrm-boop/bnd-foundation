import type { User } from '@/features/auth/types/auth.types';

const REFRESH_TOKEN_KEY = 'bnd_refresh_token';

let accessToken: string | null = null;
let onSessionUpdate: ((user: User | null) => void) | null = null;
let onForceLogout: (() => void) | null = null;

export const authSession = {
  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string | null): void {
    accessToken = token;
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string | null): void {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clear(): void {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    onSessionUpdate?.(null);
  },

  setSessionUpdateHandler(handler: (user: User | null) => void): void {
    onSessionUpdate = handler;
  },

  setForceLogoutHandler(handler: () => void): void {
    onForceLogout = handler;
  },

  notifySessionUpdate(user: User | null): void {
    onSessionUpdate?.(user);
  },

  forceLogout(): void {
    authSession.clear();
    onForceLogout?.();
  },
};
