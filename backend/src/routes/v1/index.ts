import { Router } from 'express';
import { healthRouter } from './health.routes.js';

export const v1Router = Router();

v1Router.use('/health', healthRouter);

// Feature routes will be mounted here in later phases:
// v1Router.use('/auth', authRouter);
// v1Router.use('/donations', donationRouter);
