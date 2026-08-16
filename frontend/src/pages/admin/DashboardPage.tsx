import { Link, useNavigate } from 'react-router-dom';
import {
  HandHeartIcon,
  HeartHandshakeIcon,
  ImageIcon,
  InboxIcon,
  MegaphoneIcon,
  UsersIcon,
} from 'lucide-react';
import {
  AppButton,
  AppTable,
  DashboardHero,
  LoadingSkeleton,
  StatCard,
  type AppTableColumn,
} from '@/components/app';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardQueries';
import type { DashboardActivityItem } from '@/features/dashboard/types/dashboard.types';
import { formatAudFromCents } from '@/lib/currency';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const isPositive = ['PAID', 'REVIEWED', 'READ', 'ACTIVE', 'PUBLISHED'].includes(normalized);
  const isWarning = ['NEW', 'PENDING'].includes(normalized);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        isPositive && 'bg-success/15 text-success',
        isWarning && 'bg-warning/15 text-warning',
        !isPositive && !isWarning && 'bg-muted text-muted-foreground',
      )}
    >
      {status}
    </span>
  );
}

function MonthlyDonationsChart({
  series,
}: {
  series: { label: string; totalCents: number }[];
}) {
  const max = Math.max(...series.map((item) => item.totalCents), 1);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Monthly donations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paid donation totals for the last 6 months (AUD).
        </p>
      </div>

      <div className="flex h-48 items-end gap-3">
        {series.map((item) => {
          const heightPercent = Math.max(4, Math.round((item.totalCents / max) * 100));

          return (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <p className="text-[0.65rem] font-medium text-muted-foreground">
                {item.totalCents > 0 ? formatAudFromCents(item.totalCents) : '—'}
              </p>
              <div className="flex h-36 w-full items-end rounded-md bg-muted/50 px-1.5 pb-1.5">
                <div
                  className="w-full rounded-sm bg-primary transition-all"
                  style={{ height: `${heightPercent}%` }}
                  title={formatAudFromCents(item.totalCents)}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const activityColumns: AppTableColumn<DashboardActivityItem>[] = [
  {
    key: 'title',
    header: 'Activity',
    cell: (row) => (
      <div>
        <p className="font-medium text-foreground">{row.title}</p>
        <p className="text-xs text-muted-foreground">{row.subtitle}</p>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    cell: (row) => row.type.charAt(0).toUpperCase() + row.type.slice(1),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'createdAt',
    header: 'When',
    cell: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardStats();

  return (
    <div className="space-y-10 pb-4">
      <DashboardHero
        userName={user?.firstName}
        actions={[
          {
            label: 'Donations',
            icon: HeartHandshakeIcon,
            variant: 'outline',
            onClick: () => navigate('/admin/donations'),
          },
          {
            label: 'Contact',
            icon: InboxIcon,
            variant: 'outline',
            onClick: () => navigate('/admin/contact'),
          },
          {
            label: 'Volunteers',
            icon: HandHeartIcon,
            variant: 'accent',
            onClick: () => navigate('/admin/volunteers'),
          },
        ]}
      />

      {isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : isError || !data ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Unable to load dashboard stats.</p>
          <AppButton variant="outline" className="mt-4" onClick={() => void refetch()}>
            Try again
          </AppButton>
        </div>
      ) : (
        <>
          <section aria-labelledby="dashboard-stats-heading" className="space-y-5">
            <div>
              <h2 id="dashboard-stats-heading" className="text-xl font-semibold text-foreground">
                Foundation overview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Live totals from donations, contact, volunteers, and campaigns.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total raised"
                value={formatAudFromCents(data.donations.totalPaidCents)}
                description={`${data.donations.paidCount} paid donation${data.donations.paidCount === 1 ? '' : 's'}`}
                icon={HeartHandshakeIcon}
                tone="accent"
                status={{ label: 'Paid', tone: 'success' }}
                trend={{
                  value: `${formatAudFromCents(data.donations.monthPaidCents)} this month`,
                  positive: true,
                }}
              />
              <StatCard
                label="This year"
                value={formatAudFromCents(data.donations.yearPaidCents)}
                description={`${data.donations.donorCount} unique donor${data.donations.donorCount === 1 ? '' : 's'}`}
                icon={UsersIcon}
                tone="primary"
                status={{
                  label: data.donations.pendingCount > 0 ? `${data.donations.pendingCount} pending` : 'Up to date',
                  tone: data.donations.pendingCount > 0 ? 'warning' : 'success',
                }}
              />
              <StatCard
                label="New messages"
                value={data.contacts.newCount}
                description={`${data.contacts.totalCount} total contact submissions`}
                icon={InboxIcon}
                tone="secondary"
                status={{
                  label: data.contacts.newCount > 0 ? 'Needs review' : 'Clear',
                  tone: data.contacts.newCount > 0 ? 'warning' : 'success',
                }}
              />
              <StatCard
                label="Volunteer apps"
                value={data.volunteers.newCount}
                description={`${data.volunteers.totalCount} total applications`}
                icon={HandHeartIcon}
                tone="success"
                status={{
                  label: data.volunteers.newCount > 0 ? 'New' : 'Clear',
                  tone: data.volunteers.newCount > 0 ? 'warning' : 'success',
                }}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Active campaigns"
                value={data.campaigns.activeCount}
                description={`${data.campaigns.totalCount} campaigns total`}
                icon={MegaphoneIcon}
                tone="primary"
              />
              <StatCard
                label="Gallery albums"
                value={data.gallery.publishedAlbumCount}
                description="Published albums on the public site"
                icon={ImageIcon}
                tone="neutral"
              />
              <div className="flex flex-col justify-center gap-2 rounded-xl border bg-card p-5 shadow-card sm:col-span-2 xl:col-span-1">
                <p className="text-sm font-medium text-foreground">Quick links</p>
                <div className="flex flex-wrap gap-2">
                  <AppButton asChild variant="outline" size="sm">
                    <Link to="/admin/donations">Donations</Link>
                  </AppButton>
                  <AppButton asChild variant="outline" size="sm">
                    <Link to="/admin/campaigns">Campaigns</Link>
                  </AppButton>
                  <AppButton asChild variant="outline" size="sm">
                    <Link to="/admin/gallery">Gallery</Link>
                  </AppButton>
                </div>
              </div>
            </div>
          </section>

          <MonthlyDonationsChart series={data.monthlyDonations} />

          <section aria-labelledby="recent-activity-heading" className="space-y-5">
            <div>
              <h2 id="recent-activity-heading" className="text-xl font-semibold text-foreground">
                Recent activity
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest donations, contact messages, and volunteer applications.
              </p>
            </div>

            <AppTable
              columns={activityColumns}
              data={data.recentActivity}
              getRowKey={(row) => row.id}
              emptyIcon={InboxIcon}
              emptyTitle="No recent activity"
              emptyDescription="Activity will appear here as people donate, contact you, or apply to volunteer."
            />
          </section>
        </>
      )}
    </div>
  );
}
