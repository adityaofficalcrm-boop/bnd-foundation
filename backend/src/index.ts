import 'dotenv/config';

import { createApp } from './app.js';
import { appConfig } from './config/app.config.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(appConfig.port, () => {
    logger.info('Server started', {
      port: appConfig.port,
      environment: appConfig.env,
      apiPrefix: appConfig.apiPrefix,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info('Shutdown signal received', { signal });

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', {
    error: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
});
