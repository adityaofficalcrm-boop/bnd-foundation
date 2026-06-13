import axios from 'axios';
import type {
  ApiSuccessResponse,
  LoginPayload,
  User,
} from '@/features/auth/types/auth.types';
import { authSession } from '@/features/auth/lib/auth-session';
import { env } from '@/config/env';

const publicClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let bootstrapPromise: Promise<User> | null = null;

export async function loginRequest(email: string, password: string): Promise<LoginPayload> {
  const { data } = await publicClient.post<ApiSuccessResponse<LoginPayload>>('/auth/login', {
    email,
    password,
  });

  return data.data;
}

export async function refreshTokenRequest(refreshToken: string): Promise<LoginPayload> {
  const { data } = await publicClient.post<ApiSuccessResponse<LoginPayload>>('/auth/refresh', {
    refreshToken,
  });

  return data.data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await publicClient.post('/auth/logout', { refreshToken });
}

export async function getCurrentUserRequest(accessToken: string): Promise<User> {
  const { data } = await publicClient.get<ApiSuccessResponse<User>>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return data.data;
}

/**
 * Restores session on app startup:
 * 1. Refresh tokens
 * 2. Store access token in memory
 * 3. Fetch current user via /auth/me
 *
 * Uses a singleton promise so React Strict Mode cannot fire duplicate refreshes.
 */
export async function bootstrapAuthSession(): Promise<User> {
  const refreshToken = authSession.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const payload = await refreshTokenRequest(refreshToken);

    authSession.setAccessToken(payload.tokens.accessToken);
    authSession.setRefreshToken(payload.tokens.refreshToken);

    const user = await getCurrentUserRequest(payload.tokens.accessToken);
    authSession.notifySessionUpdate(user);

    return user;
  })();

  try {
    return await bootstrapPromise;
  } finally {
    bootstrapPromise = null;
  }
}

export async function performTokenRefresh(): Promise<LoginPayload> {
  const refreshToken = authSession.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const payload = await refreshTokenRequest(refreshToken);

  authSession.setAccessToken(payload.tokens.accessToken);
  authSession.setRefreshToken(payload.tokens.refreshToken);

  const user = await getCurrentUserRequest(payload.tokens.accessToken);
  authSession.notifySessionUpdate(user);

  return { ...payload, user };
}
