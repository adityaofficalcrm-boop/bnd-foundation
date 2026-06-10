import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { appConfig } from './config/app.config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: appConfig.cors.origins,
      credentials: appConfig.cors.credentials,
    }),
  );
  app.use(express.json({ limit: appConfig.bodyParser.jsonLimit }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
