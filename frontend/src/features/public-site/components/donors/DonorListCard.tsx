import { MapPinIcon, UserIcon } from 'lucide-react';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type DonorListCardProps = {
  donor: CmsPublicPage;
};

export function DonorListCard({ donor }: DonorListCardProps) {
  const quote = donor.subheading?.trim() || donor.body?.trim();
  const amount = donor.meta?.amount?.trim();
  const location = donor.meta?.location?.trim();

  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-start sm:gap-5 md:p-5">
      {donor.imageUrl ? (
        <img
          src={donor.imageUrl}
          alt={donor.title}
          className="mx-auto size-16 shrink-0 rounded-md object-cover sm:mx-0 md:size-20"
          loading="lazy"
        />
      ) : (
        <div
          className="mx-auto flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground sm:mx-0 md:size-20"
          aria-hidden="true"
        >
          <UserIcon className="size-8 opacity-50 md:size-9" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3 className="text-base font-bold text-foreground md:text-lg">{donor.title}</h3>
          {amount ? (
            <p className="text-base font-bold text-foreground sm:shrink-0 md:text-lg">{amount}</p>
          ) : null}
        </div>

        {quote ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{quote}</p> : null}

        {location ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className="break-words">{location}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}
