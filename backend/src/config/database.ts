import mongoose from 'mongoose';
import { appConfig } from './app.config.js';
import { logger } from '../utils/logger.js';

export type DatabaseState = 'disconnected' | 'connected' | 'connecting' | 'disconnecting';

export function getDatabaseState(): DatabaseState {
  const state = mongoose.connection.readyState;

  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

function registerConnectionEvents(): void {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', { error: error.message });
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
}

export async function connectDatabase(): Promise<void> {
  if (isDatabaseConnected()) {
    logger.debug('MongoDB already connected');
    return;
  }

  mongoose.set('strictQuery', true);
  registerConnectionEvents();

  await mongoose.connect(appConfig.database.uri, appConfig.database.options);

  logger.info('MongoDB connected', {
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (!isDatabaseConnected()) {
    logger.debug('MongoDB already disconnected');
    return;
  }

  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
