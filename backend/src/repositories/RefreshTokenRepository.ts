import { BaseRepository } from './BaseRepository.js';
import type { IRefreshToken } from '../models/RefreshToken.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';

export class RefreshTokenRepository extends BaseRepository<IRefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async findByTokenHash(tokenHash: string): Promise<IRefreshToken | null> {
    return this.model.findOne({ tokenHash }).exec();
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.model.deleteOne({ tokenHash }).exec();
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ user: userId }).exec();
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
