import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { PublicDonateButton } from '@/components/layout/public/PublicDonateButton';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type StoryPageIntroProps = {
  intro: CmsPublicPage;
  pageTitle: string;
  /** When set, intro image renders here instead of beside text (hero image used in banner). */
  portraitImageUrl?: string | null;
};

export function StoryPageIntro({ intro, pageTitle, portraitImageUrl }: StoryPageIntroProps) {
  const { t } = useTranslation();
  const displayHeading = intro.subheading?.trim() || intro.title || pageTitle;
  const imageUrl = portraitImageUrl ?? intro.imageUrl;
  const imageAlt = intro.title ?? pageTitle;

  if (imageUrl) {
    return (
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-5">
          {intro.heading ? (
            <div className="flex items-center gap-3">
              <span className="h-px w-10 shrink-0 bg-primary" aria-hidden="true" />
              <p className="text-sm font-medium text-primary">{intro.heading}</p>
            </div>
          ) : null}
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{displayHeading}</h2>
          {intro.body ? (
            <CmsBodyContent body={intro.body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
          ) : null}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <PublicDonateButton size="lg" className="w-full sm:w-auto" />
            <AppButton asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/contact">{t('cta.getInTouch')}</Link>
            </AppButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute top-[10%] right-[6%] -z-10 hidden h-[78%] w-[58%] rotate-[6deg] rounded-sm bg-primary md:block"
            aria-hidden="true"
          />
          <img
            src={imageUrl}
            alt={imageAlt}
            className="relative z-10 w-full rounded-2xl object-cover shadow-elevated"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  if (!intro.body) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{intro.title ?? pageTitle}</h2>
      <CmsBodyContent body={intro.body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
    </div>
  );
}
