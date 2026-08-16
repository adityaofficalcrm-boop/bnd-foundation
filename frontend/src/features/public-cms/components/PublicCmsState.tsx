import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
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
  emptyTitle,
  emptyDescription = 'Published content for this page has not been added yet.',
  children,
}: PublicCmsStateProps) {
  const { t } = useTranslation();
  const resolvedEmptyTitle = emptyTitle ?? t('common.contentUnavailable');

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
        <h2 className="mt-4 text-lg font-semibold text-foreground">{t('common.unableToLoad')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not retrieve page content from the server. Please try again.
        </p>
        {onRetry ? (
          <AppButton className="mt-6" variant="outline" onClick={onRetry}>
            <RefreshCwIcon className="size-4" />
            {t('common.tryAgain')}
          </AppButton>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={resolvedEmptyTitle}
        description={emptyDescription}
        action={
          onRetry ? (
            <AppButton variant="outline" onClick={onRetry}>
              <RefreshCwIcon className="size-4" />
              {t('common.refresh')}
            </AppButton>
          ) : undefined
        }
      />
    );
  }

  return <>{children}</>;
}
