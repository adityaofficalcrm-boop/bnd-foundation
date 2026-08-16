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
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  seed: {
    superAdminEmail: env.SEED_SUPER_ADMIN_EMAIL,
    superAdminPassword: env.SEED_SUPER_ADMIN_PASSWORD,
    superAdminFirstName: env.SEED_SUPER_ADMIN_FIRST_NAME,
    superAdminLastName: env.SEED_SUPER_ADMIN_LAST_NAME,
  },
  recaptcha: {
    secretKey: env.RECAPTCHA_SECRET_KEY ?? '',
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
  frontendUrl: env.FRONTEND_URL,
} as const;

export type AppConfig = typeof appConfig;
