import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { resolveDonateBannerImage } from '@/config/site-assets';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type AboutDonateCtaBannerProps = {
  entry?: CmsPublicPage | null;
};

export function AboutDonateCtaBanner({ entry }: AboutDonateCtaBannerProps) {
  const { t } = useTranslation();
  const imageSrc = resolveDonateBannerImage(entry?.imageUrl);
  const title = entry?.title?.trim() || t('fallbacks.donateCause');
  const subtitle = entry?.subheading?.trim() || t('fallbacks.impactLives');
  const ctaLabel = entry?.meta?.ctaLabel?.trim() || t('cta.donateNow');
  const ctaUrl = entry?.meta?.ctaUrl?.trim() || '/donate';

  return (
    <section className="relative min-h-[240px] overflow-hidden rounded-2xl sm:min-h-[280px] sm:rounded-3xl md:min-h-[320px]">
      <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-primary/85" aria-hidden="true" />

      <div className="relative flex min-h-[240px] flex-col items-center justify-center px-4 py-10 text-center sm:min-h-[280px] sm:px-6 sm:py-14 md:min-h-[320px] md:px-10">
        <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-lg font-bold text-primary-foreground sm:text-xl md:text-2xl lg:text-3xl">
            {subtitle}
          </p>
        ) : null}
        <AppButton asChild size="lg" variant="accent" className="mt-6 w-full max-w-xs font-semibold sm:mt-8 sm:w-auto">
          <Link to={ctaUrl}>
            {ctaLabel}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </AppButton>
      </div>
    </section>
  );
}
