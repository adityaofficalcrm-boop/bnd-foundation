import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { AppButton } from '@/components/app/AppButton';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
  className?: string;
};

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center',
        className,
      )}
      role="status"
    >
      {Icon ? (
        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary" aria-hidden="true">
          <Icon className="size-6" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? (
        <div className="mt-6">{action}</div>
      ) : actionLabel && onAction ? (
        <AppButton className="mt-6" variant="primary" onClick={onAction}>
          {actionLabel}
        </AppButton>
      ) : null}
    </div>
  );
}

export { EmptyState };
