import type { CmsSection } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { PublicCmsContentBlock } from '@/features/public-cms/components/PublicCmsContent';
import { usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';

type PublicCmsFilteredViewProps = {
  section: CmsSection;
  slugPrefix?: string;
  includeSlugs?: string[];
};

export function PublicCmsFilteredView({
  section,
  slugPrefix,
  includeSlugs = [],
}: PublicCmsFilteredViewProps) {
  const { data, isLoading, isError, refetch } = usePublicCmsSection(section);

  const entries = filterPublicContentEntries(data ?? []).filter((entry) => {
    if (includeSlugs.includes(entry.slug)) {
      return true;
    }

    if (slugPrefix) {
      return entry.slug.startsWith(slugPrefix);
    }

    return true;
  });

  return (
    <PublicCmsState
      isLoading={isLoading}
      isError={isError}
      isEmpty={entries.length === 0}
      onRetry={() => void refetch()}
    >
      <div className="space-y-8">
        {entries.map((entry) => (
          <PublicCmsContentBlock key={entry.id} entry={entry} />
        ))}
      </div>
    </PublicCmsState>
  );
}
