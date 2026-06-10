import type { Response } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import type { PaginationMeta } from '../utils/apiResponse.js';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data: T,
    options?: {
      message?: string;
      statusCode?: number;
      meta?: Record<string, unknown>;
    },
  ): Response {
    return ApiResponse.success(res, data, options);
  }

  protected sendCreated<T>(res: Response, data: T, message?: string): Response {
    return ApiResponse.created(res, data, message);
  }

  protected sendPaginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message?: string,
  ): Response {
    return ApiResponse.paginated(res, data, pagination, message);
  }

  protected sendNoContent(res: Response): Response {
    return ApiResponse.noContent(res);
  }
}
