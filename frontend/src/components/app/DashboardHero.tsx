import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { AppButton } from '@/components/app/AppButton';
import { cn } from '@/lib/utils';
import { env } from '@/config/env';

type DashboardHeroAction = {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
};

type DashboardHeroProps = {
  userName?: string;
  mission?: string;
  actions?: DashboardHeroAction[];
  className?: string;
  children?: ReactNode;
};

function DashboardHero({
  userName,
  mission = 'Empowering communities through service, compassion, and sustainable impact.',
  actions = [],
  className,
  children,
}: DashboardHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground shadow-elevated',
        className,
      )}
      aria-labelledby="dashboard-hero-title"
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-secondary/20"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            {env.VITE_APP_NAME} Admin
          </div>

          <div className="space-y-2">
            <h1 id="dashboard-hero-title" className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              {userName ? `Welcome back, ${userName}` : `Welcome to ${env.VITE_APP_NAME}`}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-primary-foreground/85 md:text-base">
              {mission}
            </p>
          </div>

          {children}
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-xs font-semibold tracking-wider text-primary-foreground/70 uppercase">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {actions.map((action) => (
                <AppButton
                  key={action.label}
                  variant={action.variant ?? 'outline'}
                  size="sm"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={cn(
                    action.variant === 'outline' &&
                      'border-white/25 bg-white/10 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground',
                    action.variant === 'accent' && 'border-transparent',
                  )}
                >
                  {action.icon ? <action.icon className="size-4" /> : null}
                  {action.label}
                </AppButton>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { DashboardHero, type DashboardHeroAction };
