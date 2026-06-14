import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type StatCardTone = 'primary' | 'secondary' | 'accent' | 'success' | 'neutral';

type StatCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: LucideIcon;
  tone?: StatCardTone;
  status?: {
    label: string;
    tone?: 'success' | 'warning' | 'neutral' | 'primary';
  };
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
};

const toneStyles: Record<
  StatCardTone,
  { icon: string; accent: string; ring: string }
> = {
  primary: {
    icon: 'bg-primary/10 text-primary',
    accent: 'bg-primary',
    ring: 'ring-primary/10',
  },
  secondary: {
    icon: 'bg-secondary/10 text-secondary',
    accent: 'bg-secondary',
    ring: 'ring-secondary/10',
  },
  accent: {
    icon: 'bg-accent/20 text-accent-foreground',
    accent: 'bg-accent',
    ring: 'ring-accent/20',
  },
  success: {
    icon: 'bg-success/10 text-success',
    accent: 'bg-success',
    ring: 'ring-success/10',
  },
  neutral: {
    icon: 'bg-muted text-muted-foreground',
    accent: 'bg-muted-foreground/40',
    ring: 'ring-border',
  },
};

const statusToneStyles = {
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-muted-foreground/50',
  primary: 'bg-primary',
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'primary',
  status,
  trend,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-border/70 shadow-card ring-1 transition-shadow hover:shadow-elevated',
        styles.ring,
        className,
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1', styles.accent)} aria-hidden="true" />
      <CardContent className="p-6 pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                {label}
              </p>
              {status ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                  <span
                    className={cn('size-1.5 rounded-full', statusToneStyles[status.tone ?? 'neutral'])}
                    aria-hidden="true"
                  />
                  {status.label}
                </span>
              ) : null}
            </div>

            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{value}</p>

            {description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            ) : null}

            {trend ? (
              <p
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                  trend.positive
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {trend.value}
              </p>
            ) : null}
          </div>

          {Icon ? (
            <div
              className={cn('rounded-2xl p-3.5 shadow-sm', styles.icon)}
              aria-hidden="true"
            >
              <Icon className="size-6" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
