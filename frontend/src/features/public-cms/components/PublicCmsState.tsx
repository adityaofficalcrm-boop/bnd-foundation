import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { AppButton, EmptyState, LoadingSkeleton } from '@/components/app';

type PublicCmsStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
};

export function PublicCmsState({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyTitle = 'Content not available',
  emptyDescription = 'Published content for this page has not been added yet.',
  children,
}: PublicCmsStateProps) {
  if (isLoading) {
    return <LoadingSkeleton variant="page" rows={4} />;
  }

  if (isError) {
    return (
      <div
        className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        role="alert"
      >
        <AlertCircleIcon className="mx-auto size-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Unable to load content</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not retrieve page content from the server. Please try again.
        </p>
        {onRetry ? (
          <AppButton className="mt-6" variant="outline" onClick={onRetry}>
            <RefreshCwIcon className="size-4" />
            Try again
          </AppButton>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          onRetry ? (
            <AppButton variant="outline" onClick={onRetry}>
              <RefreshCwIcon className="size-4" />
              Refresh
            </AppButton>
          ) : undefined
        }
      />
    );
  }

  return <>{children}</>;
}
