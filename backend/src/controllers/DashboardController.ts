import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { dashboardService } from '../services/DashboardService.js';

class DashboardController extends BaseController {
  getStats = async (_req: Request, res: Response): Promise<void> => {
    const stats = await dashboardService.getStats();
    this.sendSuccess(res, stats, { message: 'Dashboard stats retrieved successfully' });
  };
}

export const dashboardController = new DashboardController();
