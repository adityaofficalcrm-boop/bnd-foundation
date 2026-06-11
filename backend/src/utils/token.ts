import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import type { AuthTokens, JwtPayload, RefreshJwtPayload } from '../types/auth.types.js';

function parseExpiresInToMs(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, appConfig.jwt.accessSecret, {
    expiresIn: appConfig.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  const refreshPayload: RefreshJwtPayload = {
    ...payload,
    type: 'refresh',
  };

  return jwt.sign(refreshPayload, appConfig.jwt.refreshSecret, {
    expiresIn: appConfig.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function generateAuthTokens(payload: JwtPayload): AuthTokens {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, appConfig.jwt.accessSecret) as JwtPayload;

    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedError('Invalid access token');
    }

    return payload;
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): RefreshJwtPayload {
  try {
    const payload = jwt.verify(token, appConfig.jwt.refreshSecret) as RefreshJwtPayload;

    if (payload.type !== 'refresh' || !payload.sub) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    return payload;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

export function getRefreshTokenExpiryDate(): Date {
  const ms = parseExpiresInToMs(appConfig.jwt.refreshExpiresIn);
  return new Date(Date.now() + ms);
}
