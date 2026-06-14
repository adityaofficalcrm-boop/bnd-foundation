import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LoadingSkeletonProps = {
  variant?: 'page' | 'card' | 'table' | 'form';
  rows?: number;
  className?: string;
};

function LoadingSkeleton({ variant = 'page', rows = 3, className }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl border bg-card p-5 shadow-card', className)} aria-hidden="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-32" />
        <Skeleton className="mt-3 h-3 w-full max-w-xs" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3 rounded-xl border bg-card p-4 shadow-card', className)} aria-hidden="true">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={cn('space-y-4', className)} aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} aria-busy="true" aria-label="Loading content">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="card" />
        ))}
      </div>
      <LoadingSkeleton variant="table" rows={rows} />
    </div>
  );
}

export { LoadingSkeleton };
