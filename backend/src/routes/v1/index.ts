import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { cmsRouter } from './cms.routes.js';
import { healthRouter } from './health.routes.js';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/cms', cmsRouter);

// Feature routes will be mounted here in later phases:
// v1Router.use('/donations', donationRouter);
