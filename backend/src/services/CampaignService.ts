import { CAMPAIGN_STATUSES } from '../constants/campaign.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { campaignRepository } from '../repositories/CampaignRepository.js';
import { BaseService } from './BaseService.js';
import type { CreateCampaignInput, UpdateCampaignInput } from '../schemas/campaign.schema.js';
import type { ICampaign } from '../models/Campaign.model.js';
import type { CampaignStatus } from '../constants/campaign.js';
import { toCampaignResponse } from '../types/campaign.types.js';

export type CampaignListParams = {
  search?: string;
  status?: CampaignStatus;
  page?: number;
  limit?: number;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError('Invalid date');
  }
  return parsed;
}

class CampaignService extends BaseService<ICampaign> {
  constructor() {
    super(campaignRepository);
  }

  async create(input: CreateCampaignInput) {
    const slug = input.slug || slugify(input.title);
    if (!slug) {
      throw new BadRequestError('Could not generate a valid slug from the title');
    }

    if (await campaignRepository.isSlugTaken(slug)) {
      throw new ConflictError('A campaign with this slug already exists');
    }

    const campaign = await campaignRepository.create({
      title: input.title,
      slug,
      description: input.description,
      goalAmountCents: dollarsToCents(input.goalAmount),
      raisedAmountCents: dollarsToCents(input.raisedAmount ?? 0),
      coverImageUrl: input.coverImageUrl?.trim() || undefined,
      status: input.status ?? CAMPAIGN_STATUSES.DRAFT,
      startDate: parseOptionalDate(input.startDate) ?? null,
      endDate: parseOptionalDate(input.endDate) ?? null,
      sortOrder: input.sortOrder ?? 0,
    });

    return toCampaignResponse(campaign);
  }

  async update(id: string, input: UpdateCampaignInput) {
    const campaign = await this.getByIdOrFail(id, 'Campaign not found');

    if (input.title !== undefined) campaign.title = input.title;
    if (input.description !== undefined) campaign.description = input.description;
    if (input.goalAmount !== undefined) campaign.goalAmountCents = dollarsToCents(input.goalAmount);
    if (input.raisedAmount !== undefined) {
      campaign.raisedAmountCents = dollarsToCents(input.raisedAmount);
    }
    if (input.coverImageUrl !== undefined) {
      campaign.coverImageUrl = input.coverImageUrl.trim() || undefined;
    }
    if (input.status !== undefined) campaign.status = input.status;
    if (input.sortOrder !== undefined) campaign.sortOrder = input.sortOrder;

    if (input.slug !== undefined) {
      const nextSlug = input.slug || slugify(input.title ?? campaign.title);
      if (!nextSlug) {
        throw new BadRequestError('Could not generate a valid slug');
      }
      if (await campaignRepository.isSlugTaken(nextSlug, id)) {
        throw new ConflictError('A campaign with this slug already exists');
      }
      campaign.slug = nextSlug;
    }

    if (input.startDate !== undefined) {
      campaign.startDate = parseOptionalDate(input.startDate) ?? null;
    }
    if (input.endDate !== undefined) {
      campaign.endDate = parseOptionalDate(input.endDate) ?? null;
    }

    await campaign.save();
    return toCampaignResponse(campaign);
  }

  async list(params: CampaignListParams) {
    const result = await campaignRepository.findWithFilters(params);

    return {
      data: result.data.map(toCampaignResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getById(id: string) {
    const campaign = await this.getByIdOrFail(id, 'Campaign not found');
    return toCampaignResponse(campaign);
  }

  async remove(id: string) {
    await campaignRepository.deleteByIdOrFail(id, 'Campaign not found');
  }

  async listPublic() {
    const campaigns = await campaignRepository.findPublic();
    return campaigns.map(toCampaignResponse);
  }

  async getPublicBySlug(slug: string) {
    const campaign = await campaignRepository.findPublicBySlug(slug);
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }
    return toCampaignResponse(campaign);
  }
}

export const campaignService = new CampaignService();
