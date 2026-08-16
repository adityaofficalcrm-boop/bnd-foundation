import { z } from 'zod';
import { resolveRecaptchaSiteKey } from '@/config/recaptcha';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_APP_NAME: z.string().default('BND Foundation'),
  VITE_RECAPTCHA_SITE_KEY: z.string().optional(),
});

const parsed = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
});

export const env = {
  ...parsed,
  VITE_RECAPTCHA_SITE_KEY: resolveRecaptchaSiteKey(parsed.VITE_RECAPTCHA_SITE_KEY),
};
