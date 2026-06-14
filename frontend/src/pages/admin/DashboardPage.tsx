import {
  ActivityIcon,
  BarChart3Icon,
  FileDownIcon,
  HeartHandshakeIcon,
  InboxIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
} from 'lucide-react';
import {
  AppButton,
  AppTable,
  DashboardHero,
  StatCard,
  type AppTableColumn,
} from '@/components/app';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

type ActivityRow = {
  id: string;
  action: string;
  module: string;
  status: 'Completed' | 'Pending' | 'Scheduled';
  date: string;
};

const recentActivity: ActivityRow[] = [
  {
    id: '1',
    action: 'Signed in',
    module: 'Authentication',
    status: 'Completed',
    date: 'Today',
  },
  {
    id: '2',
    action: 'Design system initialized',
    module: 'Admin UI',
    status: 'Completed',
    date: 'Today',
  },
  {
    id: '3',
    action: 'Dashboard viewed',
    module: 'Dashboard',
    status: 'Completed',
    date: 'Today',
  },
];

function StatusBadge({ status }: { status: ActivityRow['status'] }) {
  const styles = {
    Completed: 'bg-success/10 text-success ring-success/20',
    Pending: 'bg-warning/10 text-warning ring-warning/20',
    Scheduled: 'bg-primary/10 text-primary ring-primary/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        styles[status],
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'Completed' && 'bg-success',
          status === 'Pending' && 'bg-warning',
          status === 'Scheduled' && 'bg-primary',
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

const activityColumns: AppTableColumn<ActivityRow>[] = [
  { key: 'action', header: 'Action', cell: (row) => <span className="font-medium">{row.action}</span>, sortable: true },
  { key: 'module', header: 'Module', cell: (row) => row.module, sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'date', header: 'Date', cell: (row) => row.date, sortable: true },
];

function formatRole(role: string): string {
  return role.replace('_', ' ');
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-4">
      <DashboardHero
        userName={user?.firstName}
        actions={[
          { label: 'View reports', icon: BarChart3Icon, disabled: true, variant: 'outline' },
          { label: 'Export data', icon: FileDownIcon, disabled: true, variant: 'outline' },
          { label: 'Settings', icon: SettingsIcon, disabled: true, variant: 'accent' },
        ]}
      />

      <section aria-labelledby="dashboard-stats-heading" className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="dashboard-stats-heading" className="text-xl font-semibold text-foreground">
              Foundation overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Key indicators for your admin workspace at a glance.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active admins"
            value="1"
            description="Team members with secure panel access"
            icon={UsersIcon}
            tone="primary"
            status={{ label: 'Active', tone: 'success' }}
            trend={{ value: 'User management coming soon', positive: true }}
          />
          <StatCard
            label="Your access"
            value={user ? formatRole(user.role) : '—'}
            description="Permissions configured for your role"
            icon={ShieldCheckIcon}
            tone="secondary"
            status={{ label: 'Verified', tone: 'primary' }}
          />
          <StatCard
            label="Platform status"
            value="Ready"
            description="Foundation layer complete for upcoming modules"
            icon={HeartHandshakeIcon}
            tone="accent"
            status={{ label: 'Healthy', tone: 'success' }}
          />
          <StatCard
            label="Recent activity"
            value={recentActivity.length}
            description="Latest actions across the admin workspace"
            icon={ActivityIcon}
            tone="neutral"
            status={{ label: 'Live', tone: 'warning' }}
          />
        </div>
      </section>

      <section aria-labelledby="recent-activity-heading" className="space-y-5">
        <div>
          <h2 id="recent-activity-heading" className="text-xl font-semibold text-foreground">
            Recent activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A transparent log of recent admin actions — sorting and pagination ready for production data.
          </p>
        </div>

        <AppTable
          columns={activityColumns}
          data={recentActivity}
          getRowKey={(row) => row.id}
          emptyIcon={InboxIcon}
          footer={
            <>
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{recentActivity.length}</span> records
              </p>
              <div className="flex gap-2">
                <AppButton variant="outline" size="sm" disabled>
                  Previous
                </AppButton>
                <AppButton variant="outline" size="sm" disabled>
                  Next
                </AppButton>
              </div>
            </>
          }
        />
      </section>
    </div>
  );
}
