import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { adminNavGroups } from '@/config/admin-nav';
import { AppButton } from '@/components/app/AppButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import { env } from '@/config/env';

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const { hasRole } = useAuth();

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
      {adminNavGroups.map((group) => {
        const visibleItems = group.items.filter((item) => hasRole(...item.roles));

        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <div key={group.label} className="space-y-1.5">
            {!collapsed ? (
              <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {group.label}
              </p>
            ) : (
              <div className="mx-auto h-px w-8 bg-border" aria-hidden="true" />
            )}

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const content = (
                  <>
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed ? (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </>
                );

                if (item.disabled) {
                  return (
                    <span
                      key={item.title}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        'flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/60',
                        collapsed && 'justify-center px-2',
                      )}
                      aria-disabled="true"
                    >
                      {content}
                    </span>
                  );
                }

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/admin'}
                    onClick={onNavigate}
                    title={collapsed ? item.title : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                        collapsed && 'justify-center px-2',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm',
                      )
                    }
                  >
                    {content}
                  </NavLink>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

interface SidebarBrandProps {
  collapsed?: boolean;
}

export function SidebarBrand({ collapsed = false }: SidebarBrandProps) {
  return (
    <div className={cn('border-b border-border/80 px-4 py-5', collapsed && 'px-3 py-4')}>
      <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm"
          aria-label={`${env.VITE_APP_NAME} logo placeholder`}
          title="Foundation logo"
        >
          BND
        </div>

        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">{env.VITE_APP_NAME}</p>
            <p className="text-xs text-muted-foreground">Foundation Admin</p>
          </div>
        ) : null}
      </div>

      {!collapsed ? (
        <p className="mt-4 rounded-lg bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          Serving communities with trust, transparency, and impact.
        </p>
      ) : null}
    </div>
  );
}

interface SidebarCollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarCollapseToggle({ collapsed, onToggle }: SidebarCollapseToggleProps) {
  return (
    <div className="hidden border-t border-border/80 p-3 lg:block">
      <AppButton
        type="button"
        variant="ghost"
        size={collapsed ? 'icon' : 'md'}
        className={cn('w-full text-muted-foreground', !collapsed && 'justify-start')}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRightIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
        {!collapsed ? 'Collapse sidebar' : null}
      </AppButton>
    </div>
  );
}
