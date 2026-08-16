import { useTranslation } from 'react-i18next';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { PARTNER_GROUPS } from '@/features/cms/config/cms-content-types';
import { resolveCmsSectionDisplay } from '@/features/public-cms/utils/resolve-cms-display';
import { CountUpStat } from '@/features/public-site/components/CountUpStat';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { cn } from '@/lib/utils';

type PartnersSectionProps = {
  items: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
  orgStats?: CmsPublicPage[];
};

function groupPartners(items: CmsPublicPage[]) {
  const groups = new Map<string, CmsPublicPage[]>();

  for (const group of PARTNER_GROUPS) {
    groups.set(group.value, []);
  }

  for (const item of items) {
    const key = item.meta?.group === 'community' ? 'community' : 'funding';
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return PARTNER_GROUPS.map((group) => ({
    ...group,
    items: (groups.get(group.value) ?? []).sort((a, b) => a.sortOrder - b.sortOrder),
  })).filter((group) => group.items.length > 0);
}

function PartnerLogoGrid({
  partners,
  variant,
}: {
  partners: CmsPublicPage[];
  variant: 'funding' | 'community';
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3',
        variant === 'funding' && 'rounded-2xl bg-surface p-5 md:p-6',
      )}
    >
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="flex min-h-[72px] items-center justify-center rounded-lg bg-card p-3"
        >
          {partner.imageUrl ? (
            <img
              src={partner.imageUrl}
              alt={partner.title}
              className="max-h-14 w-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-center text-xs font-semibold leading-snug text-foreground">{partner.title}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function PartnersSection({ items, sectionHeading, orgStats = [] }: PartnersSectionProps) {
  const { t } = useTranslation();
  const grouped = groupPartners(items);
  const sortedOrgStats = [...orgStats].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasContent = grouped.length > 0 || sortedOrgStats.length > 0 || Boolean(sectionHeading);

  if (!hasContent) return null;

  const header = resolveCmsSectionDisplay(sectionHeading);
  const description =
    header.description ??
    (sectionHeading?.body?.trim() && sectionHeading.body.trim() !== header.title
      ? sectionHeading.body.trim()
      : undefined);

  return (
    <SectionShell id="partners" className="bg-background" animate={false}>
      {sortedOrgStats.length > 0 ? (
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-primary md:mb-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.12) 8px, rgba(255,255,255,0.12) 16px)',
            }}
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-2 divide-y divide-white/15 md:grid-cols-4 md:divide-x md:divide-y-0">
            {sortedOrgStats.map((metric) => {
              const statValue = metric.subheading ?? metric.title ?? '0';
              const statLabel = metric.subheading ? metric.title : metric.heading;

              return (
                <div key={metric.id} className="px-6 py-8 text-center text-primary-foreground">
                  <p className="text-4xl font-bold tracking-tight md:text-5xl">
                    <CountUpStat value={statValue} />
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-wide text-primary-foreground/90">
                    {statLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {(header.eyebrow || header.title || description) && (
        <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          {header.eyebrow ? (
            <p className="text-sm font-semibold tracking-wide text-primary">{header.eyebrow}</p>
          ) : null}
          {header.title ? (
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {header.title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </header>
      )}

      {grouped.length > 0 ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {grouped.map((group) => (
            <section key={group.value} className="space-y-5">
              <h3 className="text-center text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {t(`partnerGroups.${group.value}`)}
              </h3>
              <PartnerLogoGrid partners={group.items} variant={group.value} />
            </section>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}
