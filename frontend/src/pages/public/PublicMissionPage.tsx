import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsPageView } from '@/features/public-cms/components/PublicCmsPageView';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicMissionPage() {
  return (
    <PublicPageShell>
      <PublicCmsPageView section={CMS_SECTIONS.MISSION_VISION} variant="default" />
    </PublicPageShell>
  );
}
