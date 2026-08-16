import type { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import type { DonationStatus } from '../constants/donation.js';
import type { IDonation } from '../models/Donation.model.js';
import { Donation } from '../models/Donation.model.js';

export type DonationListFilters = {
  search?: string;
  status?: DonationStatus;
  page?: number;
  limit?: number;
};

export class DonationRepository extends BaseRepository<IDonation> {
  constructor() {
    super(Donation);
  }

  async findWithFilters(filters: DonationListFilters) {
    const query: FilterQuery<IDonation> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { donorName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { country: searchRegex },
        { transactionId: searchRegex },
      ];
    }

    return this.findPaginated(query, {
      page: filters.page,
      limit: filters.limit,
      sort: 'createdAt',
      order: 'desc',
    });
  }

  async countByStatus(status: DonationStatus): Promise<number> {
    return this.model.countDocuments({ status }).exec();
  }

  async sumPaidAmountCents(): Promise<number> {
    const [result] = await this.model
      .aggregate<{ total: number }>([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amountCents' } } },
      ])
      .exec();

    return result?.total ?? 0;
  }

  async findRecentPaid(limit = 10) {
    return this.model
      .find({ status: 'PAID' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findTopDonors(limit = 10) {
    return this.model
      .aggregate<{
        donorName: string;
        email: string;
        totalAmountCents: number;
        donationCount: number;
      }>([
        { $match: { status: 'PAID' } },
        {
          $group: {
            _id: '$email',
            donorName: { $last: '$donorName' },
            email: { $first: '$email' },
            totalAmountCents: { $sum: '$amountCents' },
            donationCount: { $sum: 1 },
          },
        },
        { $sort: { totalAmountCents: -1 } },
        { $limit: limit },
      ])
      .exec();
  }

  async findByStripeCheckoutSessionId(sessionId: string) {
    return this.model.findOne({ stripeCheckoutSessionId: sessionId }).exec();
  }

  async sumPaidAmountCentsSince(since: Date): Promise<number> {
    const [result] = await this.model
      .aggregate<{ total: number }>([
        { $match: { status: 'PAID', createdAt: { $gte: since } } },
        { $group: { _id: null, total: { $sum: '$amountCents' } } },
      ])
      .exec();

    return result?.total ?? 0;
  }

  async countPaidDonors(): Promise<number> {
    const result = await this.model.distinct('email', { status: 'PAID' }).exec();
    return result.length;
  }

  async findRecent(limit = 8) {
    return this.model.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  /** Last N calendar months of PAID donation totals (oldest → newest). */
  async monthlyPaidTotals(monthCount = 6): Promise<{ year: number; month: number; totalCents: number }[]> {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (monthCount - 1), 1));

    const rows = await this.model
      .aggregate<{ _id: { year: number; month: number }; totalCents: number }>([
        { $match: { status: 'PAID', createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalCents: { $sum: '$amountCents' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ])
      .exec();

    const byKey = new Map(rows.map((row) => [`${row._id.year}-${row._id.month}`, row.totalCents]));
    const series: { year: number; month: number; totalCents: number }[] = [];

    for (let i = monthCount - 1; i >= 0; i -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      series.push({
        year,
        month,
        totalCents: byKey.get(`${year}-${month}`) ?? 0,
      });
    }

    return series;
  }
}

export const donationRepository = new DonationRepository();
