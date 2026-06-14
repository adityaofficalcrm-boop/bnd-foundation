import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsPageView } from '@/features/public-cms/components/PublicCmsPageView';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicAboutPage() {
  return (
    <PublicPageShell>
      <PublicCmsPageView section={CMS_SECTIONS.ABOUT_US} variant="default" />
    </PublicPageShell>
  );
}
