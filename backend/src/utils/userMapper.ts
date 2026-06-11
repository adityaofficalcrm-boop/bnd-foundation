import type { IUser } from '../models/User.model.js';
import type { UserResponse } from '../types/auth.types.js';

export function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
