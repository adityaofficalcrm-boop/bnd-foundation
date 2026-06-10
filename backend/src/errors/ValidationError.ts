import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors?: unknown) {
    super(422, message, errors);
  }
}
