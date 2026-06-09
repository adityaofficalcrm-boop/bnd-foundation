import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'bnd-foundation-api',
    timestamp: new Date().toISOString(),
  });
});
