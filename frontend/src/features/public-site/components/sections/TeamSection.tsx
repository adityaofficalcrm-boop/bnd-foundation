import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type TeamSectionProps = {
  members: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function TeamSection({ members, sectionHeading }: TeamSectionProps) {
  if (members.length === 0) return null;

  return (
    <SectionShell
      id="team"
      eyebrow={sectionHeading?.heading ?? members[0]?.heading ?? undefined}
      title={sectionHeading?.title}
      description={sectionHeading?.subheading}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => (
          <article
            key={member.id}
            className="group overflow-hidden rounded-2xl border bg-card text-center shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-elevated"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {member.imageUrl ? (
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.imageUrl}
                  alt={member.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 text-4xl font-bold text-primary">
                {member.title.charAt(0)}
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-bold">{member.title}</h3>
              {member.subheading ? (
                <p className="mt-1 text-sm font-medium text-secondary">{member.subheading}</p>
              ) : null}
              {member.body ? (
                <CmsBodyContent body={member.body} className="mt-3 text-left text-sm" />
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
