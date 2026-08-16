import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { resolveCmsSectionDisplay } from '@/features/public-cms/utils/resolve-cms-display';

type FundraiseSectionProps = {
  items: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function FundraiseSection({ items, sectionHeading }: FundraiseSectionProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  const header = resolveCmsSectionDisplay(sectionHeading);

  return (
    <SectionShell
      id="fundraise"
      variant="muted"
      eyebrow={header.eyebrow}
      title={header.title ?? t('fallbacks.fundRaise')}
      description={header.description}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 motion-safe:hover:shadow-elevated"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
            ) : null}
            <div className="space-y-3 p-6">
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              {item.subheading ? <p className="text-lg font-bold text-primary">{item.subheading}</p> : null}
              <CmsBodyContent body={item.body} className="text-sm" />
              <AppButton asChild variant="outline" size="sm">
                <Link to={item.meta?.ctaUrl ?? '/donate'}>
                  {item.meta?.ctaLabel ?? t('cta.learnMore')}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </AppButton>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
