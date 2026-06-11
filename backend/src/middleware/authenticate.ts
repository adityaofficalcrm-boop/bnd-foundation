import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { userRepository } from '../repositories/UserRepository.js';
import { verifyAccessToken } from '../utils/token.js';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await userRepository.findActiveById(payload.sub);

    if (!user) {
      throw new UnauthorizedError('User account is inactive or not found');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
