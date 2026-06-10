import { env } from './env.js';

export const appConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  apiVersion: env.API_VERSION,
  apiPrefix: `/api/${env.API_VERSION}`,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  cors: {
    origins: env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  },
  database: {
    uri: env.MONGODB_URI,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  bodyParser: {
    jsonLimit: '1mb',
  },
} as const;

export type AppConfig = typeof appConfig;
