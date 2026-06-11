import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { authService } from '../services/AuthService.js';
import type { LoginInput, LogoutInput, RefreshTokenInput } from '../schemas/auth.schema.js';

class AuthController extends BaseController {
  login = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as LoginInput;
    const result = await authService.login(input);

    this.sendSuccess(res, result, {
      message: 'Login successful',
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refresh(refreshToken);

    this.sendSuccess(res, result, {
      message: 'Token refreshed successfully',
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as LogoutInput;
    await authService.logout(refreshToken);

    this.sendSuccess(res, null, {
      message: 'Logout successful',
    });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getCurrentUser(req.user!.id);

    this.sendSuccess(res, user, {
      message: 'Current user retrieved successfully',
    });
  };
}

export const authController = new AuthController();
