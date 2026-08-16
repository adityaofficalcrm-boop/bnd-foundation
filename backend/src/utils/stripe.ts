import Stripe from 'stripe';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError(503, 'Stripe is not configured. Set STRIPE_SECRET_KEY in backend/.env');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}
