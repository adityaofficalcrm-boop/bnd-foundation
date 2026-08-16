import type { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import { PUBLIC_CAMPAIGN_STATUSES, type CampaignStatus } from '../constants/campaign.js';
import type { ICampaign } from '../models/Campaign.model.js';
import { Campaign } from '../models/Campaign.model.js';

export type CampaignListFilters = {
  search?: string;
  status?: CampaignStatus;
  page?: number;
  limit?: number;
};

export class CampaignRepository extends BaseRepository<ICampaign> {
  constructor() {
    super(Campaign);
  }

  async findWithFilters(filters: CampaignListFilters) {
    const query: FilterQuery<ICampaign> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [{ title: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    return this.findPaginated(query, {
      page: filters.page,
      limit: filters.limit,
      sort: 'sortOrder',
      order: 'asc',
    });
  }

  async findPublic() {
    return this.model
      .find({ status: { $in: PUBLIC_CAMPAIGN_STATUSES } })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findPublicBySlug(slug: string) {
    return this.model
      .findOne({
        slug: slug.toLowerCase(),
        status: { $in: PUBLIC_CAMPAIGN_STATUSES },
      })
      .exec();
  }

  async findBySlug(slug: string) {
    return this.model.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<ICampaign> = { slug: slug.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await this.model.exists(query).exec();
    return Boolean(existing);
  }
}

export const campaignRepository = new CampaignRepository();
