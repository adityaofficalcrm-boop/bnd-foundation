import { appConfig } from '../config/app.config.js';
import { RECAPTCHA_ENABLED } from '../config/recaptcha.config.js';
import { BadRequestError } from '../errors/BadRequestError.js';

type RecaptchaVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

export async function verifyRecaptchaToken(token: string | undefined): Promise<void> {
  // Disabled for now — flip RECAPTCHA_ENABLED to true to require verification again
  if (!RECAPTCHA_ENABLED) {
    return;
  }

  if (!token?.trim()) {
    throw new BadRequestError('Please complete the reCAPTCHA');
  }

  const secret = appConfig.recaptcha.secretKey;

  if (!secret) {
    throw new BadRequestError('reCAPTCHA is not configured on the server');
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new BadRequestError('Unable to verify reCAPTCHA. Please try again.');
  }

  const result = (await response.json()) as RecaptchaVerifyResponse;

  if (!result.success) {
    throw new BadRequestError('reCAPTCHA verification failed. Please try again.');
  }
}
