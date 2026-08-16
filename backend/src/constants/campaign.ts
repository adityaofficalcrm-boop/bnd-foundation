export const CAMPAIGN_STATUSES = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[keyof typeof CAMPAIGN_STATUSES];

export const CAMPAIGN_STATUS_VALUES = Object.values(CAMPAIGN_STATUSES);

/** Statuses visible on the public site */
export const PUBLIC_CAMPAIGN_STATUSES: CampaignStatus[] = [
  CAMPAIGN_STATUSES.ACTIVE,
  CAMPAIGN_STATUSES.COMPLETED,
];
