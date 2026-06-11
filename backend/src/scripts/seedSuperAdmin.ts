import 'dotenv/config';

import { appConfig } from '../config/app.config.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { USER_ROLES } from '../constants/roles.js';
import { User } from '../models/User.model.js';
import { userRepository } from '../repositories/UserRepository.js';
import { logger } from '../utils/logger.js';

async function seedSuperAdmin(): Promise<void> {
  const { superAdminEmail, superAdminPassword, superAdminFirstName, superAdminLastName } =
    appConfig.seed;

  if (!superAdminEmail || !superAdminPassword || !superAdminFirstName || !superAdminLastName) {
    throw new Error(
      'Missing seed configuration. Set SEED_SUPER_ADMIN_EMAIL, SEED_SUPER_ADMIN_PASSWORD, SEED_SUPER_ADMIN_FIRST_NAME, and SEED_SUPER_ADMIN_LAST_NAME in .env',
    );
  }

  const existingSuperAdmin = await User.findOne({ role: USER_ROLES.SUPER_ADMIN }).exec();

  if (existingSuperAdmin) {
    logger.info('Super admin already exists', { email: existingSuperAdmin.email });
    return;
  }

  const emailExists = await userRepository.existsByEmail(superAdminEmail);

  if (emailExists) {
    logger.warn('Seed email already in use by another account', { email: superAdminEmail });
    return;
  }

  const superAdmin = await User.create({
    firstName: superAdminFirstName,
    lastName: superAdminLastName,
    email: superAdminEmail,
    password: superAdminPassword,
    role: USER_ROLES.SUPER_ADMIN,
    isActive: true,
  });

  logger.info('Super admin created successfully', {
    email: superAdmin.email,
    id: superAdmin._id.toString(),
  });
}

async function runSeed(): Promise<void> {
  await connectDatabase();
  await seedSuperAdmin();
  await disconnectDatabase();
}

runSeed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seed failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  });
