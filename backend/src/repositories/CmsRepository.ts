import type { FilterQuery } from 'mongoose';
import { CMS_STATUSES } from '../constants/cms.js';
import { BaseRepository } from './BaseRepository.js';
import type { ICmsPage } from '../models/CmsPage.model.js';
import { CmsPage } from '../models/CmsPage.model.js';
import type { CmsSection, CmsStatus } from '../constants/cms.js';

export type CmsListFilters = {
  search?: string;
  section?: CmsSection;
  status?: CmsStatus;
  page?: number;
  limit?: number;
};

export class CmsRepository extends BaseRepository<ICmsPage> {
  constructor() {
    super(CmsPage);
  }

  async findBySlug(slug: string): Promise<ICmsPage | null> {
    return this.model.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const filter: FilterQuery<ICmsPage> = { slug: slug.toLowerCase() };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    return this.exists(filter);
  }

  async findWithFilters(filters: CmsListFilters) {
    const query: FilterQuery<ICmsPage> = {};

    if (filters.section) {
      query.section = filters.section;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [{ title: searchRegex }, { slug: searchRegex }, { body: searchRegex }];
    }

    return this.findPaginated(query, {
      page: filters.page,
      limit: filters.limit,
      sort: 'updatedAt',
      order: 'desc',
    });
  }

  async findAllPublished(): Promise<ICmsPage[]> {
    return this.model
      .find({ status: CMS_STATUSES.PUBLISHED })
      .sort({ section: 1, sortOrder: 1, updatedAt: -1 })
      .exec();
  }

  async findPublishedBySection(section: CmsSection): Promise<ICmsPage[]> {
    return this.model
      .find({ status: CMS_STATUSES.PUBLISHED, section })
      .sort({ sortOrder: 1, updatedAt: -1 })
      .exec();
  }
}

export const cmsRepository = new CmsRepository();
