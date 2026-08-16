import { ImageIcon } from 'lucide-react';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type AboutBoardGridProps = {
  heading?: string | null;
  title: string;
  description?: string | null;
  members: CmsPublicPage[];
};

function BoardMemberPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="flex aspect-[4/5] w-full items-center justify-center bg-muted text-muted-foreground"
      aria-hidden="true"
    >
      <ImageIcon className="size-10 opacity-40" />
      <span className="sr-only">{name}</span>
    </div>
  );
}

export function AboutBoardGrid({ heading, title, description, members }: AboutBoardGridProps) {
  if (members.length === 0) {
    return null;
  }

  const sortedMembers = [...members].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  return (
    <section className="space-y-10 md:space-y-12">
      <header className="mx-auto max-w-2xl text-center">
        {heading ? (
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 shrink-0 bg-border" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">{heading}</p>
            <span className="h-px w-10 shrink-0 bg-border" aria-hidden="true" />
          </div>
        ) : null}
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </header>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
        {sortedMembers.map((member) => {
          const role = member.meta?.role ?? member.subheading ?? member.heading;

          return (
            <article key={member.id} className="text-center">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.title}
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <BoardMemberPlaceholder name={member.title} />
              )}
              <h3 className="mt-4 text-base font-bold text-foreground md:text-lg">{member.title}</h3>
              {role ? <p className="mt-1 text-sm text-muted-foreground">{role}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
