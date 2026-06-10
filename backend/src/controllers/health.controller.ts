import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { healthService } from '../services/health.service.js';

class HealthController extends BaseController {
  getHealth = (_req: Request, res: Response): void => {
    const health = healthService.getHealth();

    this.sendSuccess(res, health, {
      message: 'Health check successful',
      statusCode: health.status === 'ok' ? 200 : 503,
    });
  };
}

export const healthController = new HealthController();
