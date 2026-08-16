/** Google reCAPTCHA v2 test keys — always pass; for local development only. */
export const GOOGLE_RECAPTCHA_V2_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh7UM7YGZUXoErkvArNi';
export const GOOGLE_RECAPTCHA_V2_TEST_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMFIbcAVMVRx';

/** Secret keys contain this segment; using one as site key causes "Invalid site key". */
function looksLikeRecaptchaSecretKey(value: string): boolean {
  return value.includes('AGG-vFI') || value === GOOGLE_RECAPTCHA_V2_TEST_SECRET_KEY;
}

export function resolveRecaptchaSiteKey(raw: string | undefined): string {
  const trimmed = raw?.trim();

  if (!trimmed || looksLikeRecaptchaSecretKey(trimmed)) {
    return GOOGLE_RECAPTCHA_V2_TEST_SITE_KEY;
  }

  return trimmed;
}
