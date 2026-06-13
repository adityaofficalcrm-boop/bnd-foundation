import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  bootstrapAuthSession,
  loginRequest,
  logoutRequest,
} from '@/features/auth/api/auth.api';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/auth-context';
import { authSession } from '@/features/auth/lib/auth-session';
import type { User, UserRole } from '@/features/auth/types/auth.types';

function redirectToLogin(): void {
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const applySession = useCallback(
    (nextUser: User | null, accessToken: string | null, refreshToken: string | null) => {
      authSession.setAccessToken(accessToken);
      authSession.setRefreshToken(refreshToken);
      setUser(nextUser);
    },
    [],
  );

  useEffect(() => {
    authSession.setSessionUpdateHandler(setUser);
    authSession.setForceLogoutHandler(() => {
      setUser(null);
      redirectToLogin();
    });

    let cancelled = false;

    const initializeAuth = async () => {
      const refreshToken = authSession.getRefreshToken();

      if (!refreshToken) {
        if (!cancelled) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const currentUser = await bootstrapAuthSession();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        authSession.clear();

        if (!cancelled) {
          setUser(null);
          redirectToLogin();
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const payload = await loginRequest(email, password);
      applySession(payload.user, payload.tokens.accessToken, payload.tokens.refreshToken);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const refreshToken = authSession.getRefreshToken();

    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // Continue clearing local session even if API logout fails.
      }
    }

    authSession.clear();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) {
        return false;
      }

      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
      hasRole,
    }),
    [user, isInitializing, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
