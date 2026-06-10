import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { appConfig } from '../config/app.config.js';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { logger } from '../utils/logger.js';

function formatZodErrors(error: ZodError): unknown {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

function handleMongooseError(error: Error): AppError | null {
  if (error.name === 'ValidationError') {
    return new ValidationError('Database validation failed', error.message);
  }

  if (error.name === 'CastError') {
    return new ValidationError('Invalid identifier format');
  }

  return null;
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, 'Route not found'));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formatZodErrors(err),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors !== undefined ? { errors: err.errors } : {}),
    });
    return;
  }

  if (err instanceof Error) {
    const mongooseError = handleMongooseError(err);

    if (mongooseError) {
      res.status(mongooseError.statusCode).json({
        success: false,
        message: mongooseError.message,
        ...(mongooseError.errors !== undefined ? { errors: mongooseError.errors } : {}),
      });
      return;
    }
  }

  logger.error('Unhandled error', {
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    success: false,
    message: appConfig.isProduction ? 'Internal server error' : 'Internal server error',
    ...(!appConfig.isProduction && err instanceof Error ? { errors: err.message } : {}),
  });
}
