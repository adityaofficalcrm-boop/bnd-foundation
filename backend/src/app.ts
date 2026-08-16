import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { appConfig } from './config/app.config.js';
import { UPLOAD_DIR, ensureUploadDir } from './config/upload.config.js';
import { donationController } from './controllers/DonationController.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  ensureUploadDir();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(
    cors({
      origin: appConfig.cors.origins,
      credentials: appConfig.cors.credentials,
    }),
  );

  // Stripe webhooks require the raw body — register before JSON parser
  app.post(
    `${appConfig.apiPrefix}/donations/webhook`,
    express.raw({ type: 'application/json' }),
    asyncHandler(donationController.webhook),
  );

  app.use(express.json({ limit: appConfig.bodyParser.jsonLimit }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
