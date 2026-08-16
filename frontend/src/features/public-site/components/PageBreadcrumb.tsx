import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { NAV_SLUGS } from '@/config/public-nav';
import { cn } from '@/lib/utils';

type PageBreadcrumbProps = {
  pages: CmsPublicPage[];
  currentLabel: string;
  className?: string;
};

export function PageBreadcrumb({ pages, currentLabel, className }: PageBreadcrumbProps) {
  const { t } = useTranslation();
  const homeLabel = usePublicNavLabel(pages, NAV_SLUGS.home, t('nav.home'));

  return (
    <nav aria-label={t('a11y.breadcrumb')} className={cn('text-sm text-muted-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="transition-colors hover:text-primary">
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="size-4" />
        </li>
        <li className="font-medium text-foreground" aria-current="page">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}
