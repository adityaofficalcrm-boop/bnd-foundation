import { Router } from 'express';
import { appConfig } from '../config/app.config.js';
import { v1Router } from './v1/index.js';

export const apiRouter = Router();

apiRouter.use(`/${appConfig.apiVersion}`, v1Router);
