import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  HandHeartIcon,
  HeartHandshakeIcon,
  InboxIcon,
  type LucideIcon,
} from 'lucide-react';
import { AppButton } from '@/components/app/AppButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardQueries';
import type { DashboardStats } from '@/features/dashboard/types/dashboard.types';
import { cn } from '@/lib/utils';

type AdminNotification = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
};

function buildNotifications(stats: DashboardStats): {
  items: AdminNotification[];
  attentionCount: number;
} {
  const attentionCount =
    stats.contacts.newCount + stats.volunteers.newCount + stats.donations.pendingCount;

  const items: AdminNotification[] = [];

  if (stats.contacts.newCount > 0) {
    items.push({
      id: 'summary-contacts',
      title:
        stats.contacts.newCount === 1
          ? '1 new contact message'
          : `${stats.contacts.newCount} new contact messages`,
      subtitle: 'Open the contact inbox',
      href: '/admin/contact',
      icon: InboxIcon,
    });
  }

  if (stats.volunteers.newCount > 0) {
    items.push({
      id: 'summary-volunteers',
      title:
        stats.volunteers.newCount === 1
          ? '1 new volunteer application'
          : `${stats.volunteers.newCount} new volunteer applications`,
      subtitle: 'Review volunteer applications',
      href: '/admin/volunteers',
      icon: HandHeartIcon,
    });
  }

  if (stats.donations.pendingCount > 0) {
    items.push({
      id: 'summary-donations',
      title:
        stats.donations.pendingCount === 1
          ? '1 pending donation'
          : `${stats.donations.pendingCount} pending donations`,
      subtitle: 'Check donation status',
      href: '/admin/donations',
      icon: HeartHandshakeIcon,
    });
  }

  return { items, attentionCount };
}

export function AdminNotificationsMenu() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardStats();

  const { items, attentionCount } = data
    ? buildNotifications(data)
    : { items: [] as AdminNotification[], attentionCount: 0 };

  const badgeLabel =
    attentionCount > 9 ? '9+' : attentionCount > 0 ? String(attentionCount) : null;

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) void refetch();
      }}
    >
      <DropdownMenuTrigger asChild>
        <AppButton
          variant="outline"
          size="icon"
          className="relative size-10 rounded-xl"
          aria-label={
            attentionCount > 0
              ? `Notifications, ${attentionCount} needing attention`
              : 'Notifications'
          }
        >
          <BellIcon className="size-4" />
          {badgeLabel ? (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground ring-2 ring-background">
              {badgeLabel}
            </span>
          ) : null}
        </AppButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2.5">
          <span>Notifications</span>
          {attentionCount > 0 ? (
            <span className="text-xs font-normal text-muted-foreground">
              {attentionCount} need attention
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />

        {isLoading ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <div className="space-y-2 px-3 py-4 text-center">
            <p className="text-sm text-muted-foreground">Unable to load notifications.</p>
            <AppButton variant="outline" size="sm" onClick={() => void refetch()}>
              Try again
            </AppButton>
          </div>
        ) : items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up — no new messages, volunteers, or pending donations.
          </p>
        ) : (
          <div className="py-1">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer gap-3 rounded-none px-3 py-2.5"
                onSelect={() => navigate(item.href)}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
                  )}
                >
                  <item.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  {item.subtitle ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.subtitle}
                    </span>
                  ) : null}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="cursor-pointer justify-center rounded-none py-2.5 text-sm font-medium text-primary"
          onSelect={() => navigate('/admin')}
        >
          View dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
