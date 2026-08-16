import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

type TeamMemberGridProps = {
  title: string;
  members: CmsPublicPage[];
  columns?: 4 | 6;
};

function MemberPlaceholder({ name }: { name: string }) {
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

export function TeamMemberGrid({ title, members, columns = 4 }: TeamMemberGridProps) {
  if (members.length === 0) {
    return null;
  }

  const sortedMembers = [...members].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  return (
    <section className="space-y-8 md:space-y-10">
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>

      <div
        className={cn(
          'grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 lg:gap-x-8 lg:gap-y-10',
          columns === 6 ? 'lg:grid-cols-4 xl:grid-cols-6' : 'lg:grid-cols-4',
        )}
      >
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
                <MemberPlaceholder name={member.title} />
              )}
              <h3 className="mt-4 text-sm font-bold text-foreground sm:text-base md:text-lg">{member.title}</h3>
              {role ? <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{role}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
