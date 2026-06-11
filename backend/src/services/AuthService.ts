import { Types } from 'mongoose';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { refreshTokenRepository } from '../repositories/RefreshTokenRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import type { LoginInput } from '../schemas/auth.schema.js';
import type { LoginResponse, UserResponse } from '../types/auth.types.js';
import {
  generateAuthTokens,
  getRefreshTokenExpiryDate,
  hashToken,
  verifyRefreshToken,
} from '../utils/token.js';
import { toUserResponse } from '../utils/userMapper.js';
import { BaseService } from './BaseService.js';
import type { IUser } from '../models/User.model.js';

export class AuthService extends BaseService<IUser> {
  constructor() {
    super(userRepository);
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await userRepository.findByEmailWithPassword(input.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await userRepository.updateLastLogin(user._id.toString());

    const tokens = generateAuthTokens({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);

    const updatedUser = await userRepository.findById(user._id.toString());
    const userResponse = toUserResponse(updatedUser ?? user);

    return { user: userResponse, tokens };
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);

    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError('Invalid or revoked refresh token');
    }

    const user = await userRepository.findActiveById(payload.sub);

    if (!user) {
      await refreshTokenRepository.deleteByTokenHash(tokenHash);
      throw new UnauthorizedError('User account is inactive or not found');
    }

    await refreshTokenRepository.deleteByTokenHash(tokenHash);

    const tokens = generateAuthTokens({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: toUserResponse(user),
      tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await refreshTokenRepository.deleteByTokenHash(tokenHash);
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await userRepository.findActiveById(userId);

    if (!user) {
      throw new UnauthorizedError('User account is inactive or not found');
    }

    return toUserResponse(user);
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await refreshTokenRepository.create({
      user: new Types.ObjectId(userId),
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshTokenExpiryDate(),
    });
  }
}

export const authService = new AuthService();
