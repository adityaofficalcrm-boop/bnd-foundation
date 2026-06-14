import type { CmsSection } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import {
  PublicCmsContactBlock,
  PublicCmsContentBlock,
  PublicCmsHero,
} from '@/features/public-cms/components/PublicCmsContent';
import { usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';

type PublicCmsPageViewProps = {
  section: CmsSection;
  variant?: 'home' | 'default' | 'contact';
};

export function PublicCmsPageView({ section, variant = 'default' }: PublicCmsPageViewProps) {
  const { data, isLoading, isError, refetch } = usePublicCmsSection(section);
  const entries = data ?? [];

  return (
    <PublicCmsState
      isLoading={isLoading}
      isError={isError}
      isEmpty={entries.length === 0}
      onRetry={() => void refetch()}
    >
      <div className="space-y-8">
        {variant === 'home' && entries[0] ? (
          <>
            <PublicCmsHero entry={entries[0]} />
            {entries.slice(1).map((entry) => (
              <PublicCmsContentBlock key={entry.id} entry={entry} />
            ))}
          </>
        ) : null}

        {variant === 'contact'
          ? entries.map((entry) => <PublicCmsContactBlock key={entry.id} entry={entry} />)
          : null}

        {variant === 'default'
          ? entries.map((entry) => <PublicCmsContentBlock key={entry.id} entry={entry} />)
          : null}
      </div>
    </PublicCmsState>
  );
}
