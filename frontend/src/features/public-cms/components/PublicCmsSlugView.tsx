import type { CmsSection } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { PublicCmsContentBlock } from '@/features/public-cms/components/PublicCmsContent';
import { usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';

type PublicCmsSlugViewProps = {
  section: CmsSection;
  slug: string;
};

export function PublicCmsSlugView({ section, slug }: PublicCmsSlugViewProps) {
  const { data, isLoading, isError, refetch } = usePublicCmsSection(section);
  const entry = data?.find((item) => item.slug === slug) ?? null;

  return (
    <PublicCmsState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!entry}
      onRetry={() => void refetch()}
      emptyDescription={`Content for "${slug}" has not been published yet.`}
    >
      {entry ? <PublicCmsContentBlock entry={entry} /> : null}
    </PublicCmsState>
  );
}
