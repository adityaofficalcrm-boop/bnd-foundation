import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { userRepository } from '../repositories/UserRepository.js';
import { appConfig } from '../config/app.config.js';
import { logger } from '../utils/logger.js';

async function resetSuperAdminPassword(): Promise<void> {
  const email = appConfig.seed.superAdminEmail;
  const password = appConfig.seed.superAdminPassword;

  if (!email || !password) {
    throw new Error('Set SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD in backend/.env');
  }

  const user = await userRepository.findByEmailWithPassword(email);

  if (!user) {
    throw new Error(`No user found for ${email}. Run npm run seed -w backend first.`);
  }

  user.password = password;
  user.isActive = true;
  await user.save();

  logger.info('Super admin password reset', { email });
}

async function run(): Promise<void> {
  await connectDatabase();
  await resetSuperAdminPassword();
  await disconnectDatabase();
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Password reset failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  });
