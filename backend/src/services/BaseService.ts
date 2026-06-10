import type { Document } from 'mongoose';
import type { BaseRepository } from '../repositories/BaseRepository.js';
import type { PaginatedResult, PaginationOptions } from '../types/common.types.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export abstract class BaseService<TDocument extends Document> {
  constructor(protected readonly repository: BaseRepository<TDocument>) {}

  protected async getByIdOrFail(id: string, message?: string): Promise<TDocument> {
    return this.repository.findByIdOrFail(id, message);
  }

  protected async getPaginated(
    filter: Record<string, unknown> = {},
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<TDocument>> {
    return this.repository.findPaginated(filter, options);
  }

  protected ensureFound<T>(value: T | null, message: string): T {
    if (value === null) {
      throw new NotFoundError(message);
    }

    return value;
  }
}
