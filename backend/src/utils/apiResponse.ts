import type { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    options?: {
      message?: string;
      statusCode?: number;
      meta?: Record<string, unknown>;
    },
  ): Response<ApiSuccessResponse<T>> {
    const statusCode = options?.statusCode ?? 200;

    return res.status(statusCode).json({
      success: true,
      message: options?.message ?? 'Request successful',
      data,
      ...(options?.meta ? { meta: options.meta } : {}),
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully',
  ): Response<ApiSuccessResponse<T>> {
    return ApiResponse.success(res, data, { message, statusCode: 201 });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Request successful',
  ): Response<ApiSuccessResponse<T[]>> {
    return ApiResponse.success(res, data, {
      message,
      meta: { pagination },
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
