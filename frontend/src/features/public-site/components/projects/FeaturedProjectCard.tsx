import { ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type FeaturedProjectCardProps = {
  project: CmsPublicPage;
};

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { t } = useTranslation();
  const sectionLabel = project.heading?.trim() || t('fallbacks.ongoingProject');
  const ctaLabel = project.meta?.ctaLabel?.trim() || t('fallbacks.applyStudentSupport');
  const ctaUrl = project.meta?.ctaUrl?.trim();

  return (
    <section className="space-y-6">
      <h2 className="text-center text-xl font-bold text-primary md:text-2xl">{sectionLabel}</h2>

      <article className="overflow-hidden rounded-2xl border bg-card shadow-card lg:grid lg:grid-cols-2">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full min-h-64 w-full object-cover object-top lg:min-h-full"
            loading="lazy"
          />
        ) : (
          <div className="min-h-64 bg-muted lg:min-h-full" aria-hidden="true" />
        )}

        <div className="space-y-4 p-6 md:p-8 lg:p-10">
          <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{project.title}</h3>
          {project.subheading ? (
            <p className="text-base font-medium text-primary md:text-lg">{project.subheading}</p>
          ) : null}
          <CmsBodyContent body={project.body} className="text-sm leading-relaxed md:text-base" />
          {ctaUrl ? (
            <AppButton asChild variant="primary" size="lg" className="mt-2 w-full font-semibold sm:w-auto">
              <a href={ctaUrl} target="_blank" rel="noreferrer">
                {ctaLabel}
                <ExternalLinkIcon className="size-4" aria-hidden="true" />
              </a>
            </AppButton>
          ) : null}
        </div>
      </article>
    </section>
  );
}
