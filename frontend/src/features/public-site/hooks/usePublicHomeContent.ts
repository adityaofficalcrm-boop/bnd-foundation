import { useMemo } from 'react';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { isAboutSubpageSlug } from '@/config/public-nav';
import { filterHomeAboutEntries } from '@/features/public-site/utils/partition-about-landing';
import { filterHomeMissionVisionEntries } from '@/features/public-site/utils/partition-mission-vision';
import { partitionHomeContent } from '@/features/public-site/utils/partition-home-content';

export function usePublicHomeContent() {
  const homeQuery = usePublicCmsSection(CMS_SECTIONS.HOME);
  const aboutQuery = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const missionQuery = usePublicCmsSection(CMS_SECTIONS.MISSION_VISION);
  const contactQuery = usePublicCmsSection(CMS_SECTIONS.CONTACT_INFO);

  const homeContent = useMemo(
    () => partitionHomeContent(filterPublicContentEntries(homeQuery.data ?? [])),
    [homeQuery.data],
  );

  const aboutEntries = useMemo(() => {
    return filterHomeAboutEntries(aboutQuery.data ?? []).filter(
      (entry) =>
        !isAboutSubpageSlug(entry.slug) &&
        !entry.slug.startsWith('team-') &&
        entry.slug !== 'team' &&
        entry.slug !== 'about-team',
    );
  }, [aboutQuery.data]);

  const isLoading =
    homeQuery.isLoading || aboutQuery.isLoading || missionQuery.isLoading || contactQuery.isLoading;

  const isError =
    homeQuery.isError || aboutQuery.isError || missionQuery.isError || contactQuery.isError;

  const refetchAll = () => {
    void homeQuery.refetch();
    void aboutQuery.refetch();
    void missionQuery.refetch();
    void contactQuery.refetch();
  };

  return {
    homeContent,
    aboutEntries,
    missionEntries: filterHomeMissionVisionEntries(missionQuery.data ?? []),
    contactEntries: filterPublicContentEntries(contactQuery.data ?? []),
    isLoading,
    isError,
    refetchAll,
  };
}
