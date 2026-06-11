import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../constants/roles.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to perform this action'));
      return;
    }

    next();
  };
}
