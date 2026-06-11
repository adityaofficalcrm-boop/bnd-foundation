import { BaseRepository } from './BaseRepository.js';
import type { IUser } from '../models/User.model.js';
import { User } from '../models/User.model.js';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  async findActiveById(id: string): Promise<IUser | null> {
    return this.model.findOne({ _id: id, isActive: true }).exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { lastLogin: new Date() }).exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email: email.toLowerCase() });
  }
}

export const userRepository = new UserRepository();
