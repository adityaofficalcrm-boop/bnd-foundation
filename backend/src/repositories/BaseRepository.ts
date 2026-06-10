import type { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { NotFoundError } from '../errors/NotFoundError.js';
import type { PaginatedResult, PaginationOptions } from '../types/common.types.js';
import { buildPaginationMeta } from '../utils/validation.js';

export abstract class BaseRepository<TDocument extends Document> {
  constructor(protected readonly model: Model<TDocument>) {}

  async findById(id: string): Promise<TDocument | null> {
    return this.model.findById(id).exec();
  }

  async findByIdOrFail(id: string, message?: string): Promise<TDocument> {
    const document = await this.findById(id);

    if (!document) {
      throw new NotFoundError(message ?? `${this.model.modelName} not found`);
    }

    return document;
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(filter: FilterQuery<TDocument> = {}): Promise<TDocument[]> {
    return this.model.find(filter).exec();
  }

  async findPaginated(
    filter: FilterQuery<TDocument> = {},
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<TDocument>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const sortField = options.sort ?? 'createdAt';
    const sortOrder = options.order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    const meta = buildPaginationMeta(total, page, limit);

    return {
      data,
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages,
    };
  }

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return this.model.create(data);
  }

  async updateById(
    id: string,
    data: UpdateQuery<TDocument>,
    options: QueryOptions = { new: true, runValidators: true },
  ): Promise<TDocument | null> {
    return this.model.findByIdAndUpdate(id, data, options).exec();
  }

  async updateByIdOrFail(
    id: string,
    data: UpdateQuery<TDocument>,
    message?: string,
  ): Promise<TDocument> {
    const document = await this.updateById(id, data);

    if (!document) {
      throw new NotFoundError(message ?? `${this.model.modelName} not found`);
    }

    return document;
  }

  async deleteById(id: string): Promise<TDocument | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteByIdOrFail(id: string, message?: string): Promise<TDocument> {
    const document = await this.deleteById(id);

    if (!document) {
      throw new NotFoundError(message ?? `${this.model.modelName} not found`);
    }

    return document;
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return result !== null;
  }
}
