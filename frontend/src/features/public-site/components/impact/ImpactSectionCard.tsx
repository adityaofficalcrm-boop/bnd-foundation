import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { cn } from '@/lib/utils';

type ImpactSectionCardProps = {
  entry: CmsPublicPage;
  reverse?: boolean;
};

export function ImpactSectionCard({ entry, reverse = false }: ImpactSectionCardProps) {
  const imageAlt = entry.title ?? entry.heading ?? '';

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-card">
      <div
        className={cn(
          'grid lg:grid-cols-2',
          reverse && 'lg:[&>*:first-child]:order-2',
        )}
      >
        {entry.imageUrl ? (
          <div className="relative min-h-[220px] lg:min-h-[320px]">
            <img
              src={entry.imageUrl}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="hidden min-h-[220px] bg-muted lg:block" aria-hidden="true" />
        )}

        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{entry.title}</h2>
          {entry.body ? (
            <CmsBodyContent
              body={entry.body}
              className="mt-4 text-sm leading-relaxed md:text-base [&_ul]:mt-4"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
