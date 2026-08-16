import { ConflictError } from '../errors/ConflictError.js';
import { CMS_STATUSES, type CmsSection } from '../constants/cms.js';
import type { ICmsPage } from '../models/CmsPage.model.js';
import { cmsRepository, type CmsListFilters } from '../repositories/CmsRepository.js';
import type { CreateCmsInput, UpdateCmsInput } from '../schemas/cms.schema.js';
import { sanitizeCmsMeta, toCmsPageResponse, toCmsPublicPageResponse, type CmsPageResponse, type CmsPublicPageResponse } from '../types/cms.types.js';
import { BaseService } from './BaseService.js';
import type { UpdateQuery } from 'mongoose';

const CLEARABLE_TEXT_FIELDS = ['heading', 'subheading', 'imageUrl'] as const;

function normalizeOptionalText(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function buildCmsUpdateQuery(input: UpdateCmsInput, userId: string, publishedAt: Date | null | undefined): UpdateQuery<ICmsPage> {
  const set: Record<string, unknown> = {
    updatedBy: userId,
  };

  if (publishedAt !== undefined) {
    set.publishedAt = publishedAt;
  }

  if (input.section !== undefined) set.section = input.section;
  if (input.slug !== undefined) set.slug = input.slug.toLowerCase();
  if (input.body !== undefined) set.body = input.body;
  if (input.status !== undefined) set.status = input.status;
  if (input.sortOrder !== undefined) set.sortOrder = input.sortOrder;
  if (input.title !== undefined) set.title = input.title.trim();

  if (input.meta !== undefined) {
    set.meta = sanitizeCmsMeta(input.meta);
  }

  const unset: Record<string, 1> = {};

  for (const field of CLEARABLE_TEXT_FIELDS) {
    if (input[field] === undefined) {
      continue;
    }

    const normalized = normalizeOptionalText(input[field]);

    if (normalized) {
      set[field] = normalized;
    } else {
      unset[field] = 1;
    }
  }

  const updateQuery: UpdateQuery<ICmsPage> = { $set: set };

  if (Object.keys(unset).length > 0) {
    updateQuery.$unset = unset;
  }

  return updateQuery;
}

export class CmsService extends BaseService<ICmsPage> {
  constructor() {
    super(cmsRepository);
  }

  async list(filters: CmsListFilters) {
    const result = await cmsRepository.findWithFilters(filters);

    return {
      data: result.data.map(toCmsPageResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getById(id: string): Promise<CmsPageResponse> {
    const page = await this.getByIdOrFail(id, 'CMS page not found');
    return toCmsPageResponse(page);
  }

  async create(input: CreateCmsInput, userId: string): Promise<CmsPageResponse> {
    const slugExists = await cmsRepository.slugExists(input.slug);

    if (slugExists) {
      throw new ConflictError('A CMS page with this slug already exists');
    }

    const publishedAt = input.status === CMS_STATUSES.PUBLISHED ? new Date() : null;

    const page = await cmsRepository.create({
      ...input,
      title: input.title.trim(),
      slug: input.slug.toLowerCase(),
      heading: normalizeOptionalText(input.heading),
      subheading: normalizeOptionalText(input.subheading),
      imageUrl: normalizeOptionalText(input.imageUrl),
      meta: sanitizeCmsMeta(input.meta),
      publishedAt,
      createdBy: userId,
      updatedBy: userId,
    } as never);

    return toCmsPageResponse(page);
  }

  async update(id: string, input: UpdateCmsInput, userId: string): Promise<CmsPageResponse> {
    const existing = await this.getByIdOrFail(id, 'CMS page not found');

    if (input.slug) {
      const slugExists = await cmsRepository.slugExists(input.slug, id);

      if (slugExists) {
        throw new ConflictError('A CMS page with this slug already exists');
      }
    }

    let publishedAt = existing.publishedAt;

    if (input.status === CMS_STATUSES.PUBLISHED && existing.status !== CMS_STATUSES.PUBLISHED) {
      publishedAt = new Date();
    }

    if (input.status === CMS_STATUSES.DRAFT) {
      publishedAt = null;
    }

    const page = await cmsRepository.updateByIdOrFail(
      id,
      buildCmsUpdateQuery(input, userId, publishedAt),
      'CMS page not found',
    );

    return toCmsPageResponse(page);
  }

  async remove(id: string): Promise<void> {
    await cmsRepository.deleteByIdOrFail(id, 'CMS page not found');
  }

  async listPublic(): Promise<CmsPublicPageResponse[]> {
    const pages = await cmsRepository.findAllPublished();
    return pages.map(toCmsPublicPageResponse);
  }

  async getPublicBySection(section: CmsSection): Promise<CmsPublicPageResponse[]> {
    const pages = await cmsRepository.findPublishedBySection(section);
    return pages.map(toCmsPublicPageResponse);
  }
}

export const cmsService = new CmsService();
