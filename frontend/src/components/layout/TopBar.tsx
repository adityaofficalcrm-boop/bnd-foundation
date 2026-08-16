import { ChevronDownIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BreadcrumbItem } from '@/components/app/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminNotificationsMenu } from '@/components/layout/AdminNotificationsMenu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import { env } from '@/config/env';

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatRole(role: string): string {
  return role.replace('_', ' ');
}

function TopBarBreadcrumbs({ items }: { items?: BreadcrumbItem[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:block">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-border" aria-hidden="true">/</span> : null}
              <span className={cn(isLast && 'font-medium text-foreground')}>{item.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-border/80 bg-background px-2 py-1.5 pl-1.5 shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open account menu"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 text-left md:block">
            <p className="truncate text-sm leading-none font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{formatRole(user.role)}</p>
          </div>
          <ChevronDownIcon className="hidden size-4 text-muted-foreground md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserIcon className="size-4" />
          My profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <SettingsIcon className="size-4" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void handleLogout()}
          className="text-destructive focus:text-destructive"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TopBarProps {
  mobileTrigger?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function TopBar({ mobileTrigger, breadcrumbs }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="flex h-[4.25rem] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {mobileTrigger}
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-foreground">{env.VITE_APP_NAME}</p>
            <TopBarBreadcrumbs items={breadcrumbs} />
          </div>
          <div className="lg:hidden">
            <TopBarBreadcrumbs items={breadcrumbs} />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <AdminNotificationsMenu />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
