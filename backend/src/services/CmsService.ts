import { ConflictError } from '../errors/ConflictError.js';
import { CMS_STATUSES, type CmsSection } from '../constants/cms.js';
import type { ICmsPage } from '../models/CmsPage.model.js';
import { cmsRepository, type CmsListFilters } from '../repositories/CmsRepository.js';
import type { CreateCmsInput, UpdateCmsInput } from '../schemas/cms.schema.js';
import { sanitizeCmsMeta, toCmsPageResponse, toCmsPublicPageResponse, type CmsPageResponse, type CmsPublicPageResponse } from '../types/cms.types.js';
import { BaseService } from './BaseService.js';

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
      slug: input.slug.toLowerCase(),
      imageUrl: input.imageUrl || undefined,
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
      {
        ...input,
        ...(input.slug ? { slug: input.slug.toLowerCase() } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || undefined } : {}),
        ...(input.meta !== undefined ? { meta: sanitizeCmsMeta(input.meta) } : {}),
        publishedAt,
        updatedBy: userId,
      },
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
