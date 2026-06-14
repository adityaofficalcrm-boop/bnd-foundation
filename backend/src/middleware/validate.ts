import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type RequestSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.validatedQuery = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
