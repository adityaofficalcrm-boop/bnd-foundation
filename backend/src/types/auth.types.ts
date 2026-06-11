import type { UserRole } from '../constants/roles.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface RefreshJwtPayload extends JwtPayload {
  type: 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserResponse;
  tokens: AuthTokens;
}
