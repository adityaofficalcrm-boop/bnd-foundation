import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { cn } from '@/lib/utils';

type StorySectionRowProps = {
  entry: CmsPublicPage;
  reverse?: boolean;
};

export function StorySectionRow({ entry, reverse = false }: StorySectionRowProps) {
  const imageAlt = entry.heading ?? entry.title;

  return (
    <article
      className={cn(
        'grid items-center gap-8 lg:grid-cols-2 lg:gap-12',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {entry.imageUrl ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <img
            src={entry.imageUrl}
            alt={imageAlt}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        {entry.heading ? (
          <p className="text-sm font-semibold tracking-[0.18em] text-secondary uppercase">{entry.heading}</p>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{entry.title}</h2>
        {entry.subheading ? (
          <p className="text-lg font-medium text-primary">{entry.subheading}</p>
        ) : null}
        <CmsBodyContent body={entry.body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
      </div>
    </article>
  );
}
