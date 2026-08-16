import { ImageIcon } from 'lucide-react';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type GrantListCardProps = {
  grant: CmsPublicPage;
};

export function GrantListCard({ grant }: GrantListCardProps) {
  const provider = grant.meta?.grantProvider?.trim();
  const amount = grant.meta?.amount?.trim() || grant.subheading?.trim();

  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6 md:p-6">
      {grant.imageUrl ? (
        <img
          src={grant.imageUrl}
          alt={provider || grant.title}
          className="mx-auto size-20 shrink-0 rounded-md border bg-white object-contain p-2 sm:mx-0 md:size-24"
          loading="lazy"
        />
      ) : (
        <div
          className="mx-auto flex size-20 shrink-0 items-center justify-center rounded-md border bg-white text-muted-foreground sm:mx-0 md:size-24"
          aria-hidden="true"
        >
          <ImageIcon className="size-8 opacity-40" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3 className="text-base font-bold text-foreground md:text-lg">{grant.title}</h3>
          {amount ? (
            <p className="text-base font-bold text-foreground sm:shrink-0 md:text-lg">{amount}</p>
          ) : null}
        </div>

        {provider ? (
          <p className="mt-1 text-sm italic text-muted-foreground md:text-base">
            Grant Provider: {provider}
          </p>
        ) : null}

        {grant.body?.trim() ? (
          <CmsBodyContent body={grant.body} className="mt-3 text-sm leading-relaxed md:text-base" />
        ) : null}
      </div>
    </article>
  );
}
