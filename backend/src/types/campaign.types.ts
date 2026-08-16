import type { CampaignStatus } from '../constants/campaign.js';
import type { ICampaign } from '../models/Campaign.model.js';

export type CampaignResponse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  goalAmountCents: number;
  raisedAmountCents: number;
  coverImageUrl?: string;
  status: CampaignStatus;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function toCampaignResponse(campaign: ICampaign): CampaignResponse {
  return {
    id: campaign.id,
    title: campaign.title,
    slug: campaign.slug,
    description: campaign.description,
    goalAmountCents: campaign.goalAmountCents,
    raisedAmountCents: campaign.raisedAmountCents,
    coverImageUrl: campaign.coverImageUrl || undefined,
    status: campaign.status,
    startDate: campaign.startDate ? campaign.startDate.toISOString() : null,
    endDate: campaign.endDate ? campaign.endDate.toISOString() : null,
    sortOrder: campaign.sortOrder,
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString(),
  };
}
