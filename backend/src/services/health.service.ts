import { appConfig } from '../config/app.config.js';
import { getDatabaseState, isDatabaseConnected } from '../config/database.js';

export type HealthStatus = {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  database: {
    connected: boolean;
    state: ReturnType<typeof getDatabaseState>;
  };
};

export class HealthService {
  getHealth(): HealthStatus {
    const dbConnected = isDatabaseConnected();

    return {
      status: dbConnected ? 'ok' : 'degraded',
      service: 'bnd-foundation-api',
      version: appConfig.apiVersion,
      environment: appConfig.env,
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        state: getDatabaseState(),
      },
    };
  }
}

export const healthService = new HealthService();
