import { AppError } from './AppError.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors?: unknown) {
    super(400, message, errors);
  }
}
