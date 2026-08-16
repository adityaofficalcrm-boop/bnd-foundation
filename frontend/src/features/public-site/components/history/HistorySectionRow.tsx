import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { cn } from '@/lib/utils';

type HistorySectionRowProps = {
  entry: CmsPublicPage;
  reverse?: boolean;
};

export function HistorySectionRow({ entry, reverse = false }: HistorySectionRowProps) {
  const imageAlt = entry.title ?? entry.heading ?? '';

  const imageColumn = entry.imageUrl ? (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className={cn(
          'absolute top-[10%] -z-10 hidden h-[78%] w-[58%] rounded-sm bg-primary md:block',
          reverse ? 'left-[6%] -rotate-[6deg]' : 'right-[6%] rotate-[6deg]',
        )}
        aria-hidden="true"
      />
      <img
        src={entry.imageUrl}
        alt={imageAlt}
        className="relative z-10 aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-elevated"
        loading="lazy"
      />
    </div>
  ) : null;

  const contentColumn = (
    <div className="space-y-5">
      {entry.heading ? (
        <div className="flex items-center gap-3">
          <span className="h-px w-10 shrink-0 bg-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-primary">{entry.heading}</p>
        </div>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{entry.title}</h2>
      {entry.body ? (
        <CmsBodyContent body={entry.body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
      ) : null}
    </div>
  );

  if (!imageColumn) {
    return (
      <article className="mx-auto max-w-3xl">
        {contentColumn}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {imageColumn}
      {contentColumn}
    </article>
  );
}
