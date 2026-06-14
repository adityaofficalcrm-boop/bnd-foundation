import { ImagesIcon } from 'lucide-react';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type GalleryPreviewSectionProps = {
  items: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function GalleryPreviewSection({ items, sectionHeading }: GalleryPreviewSectionProps) {
  if (items.length === 0) return null;

  return (
    <SectionShell
      id="gallery"
      variant="muted"
      eyebrow={sectionHeading?.heading ?? items[0]?.heading ?? undefined}
      title={sectionHeading?.title}
      description={sectionHeading?.subheading}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <figure
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-elevated"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted">
                <ImagesIcon className="size-10 text-muted-foreground" />
              </div>
            )}
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary/95 to-primary/40 p-4 text-primary-foreground transition-transform duration-300 group-hover:translate-y-0">
              <p className="font-semibold">{item.title}</p>
              {item.subheading ? <p className="mt-1 text-xs text-primary-foreground/85">{item.subheading}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
