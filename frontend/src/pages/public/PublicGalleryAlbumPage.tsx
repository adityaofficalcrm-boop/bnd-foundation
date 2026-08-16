import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, FilmIcon, ImageIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton, LoadingSkeleton } from '@/components/app';
import { usePublicGalleryAlbum } from '@/features/gallery/hooks/useGalleryQueries';
import {
  GALLERY_MEDIA_TYPES,
  type GalleryItem,
} from '@/features/gallery/types/gallery.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicGalleryAlbumPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data: album, isLoading, isError } = usePublicGalleryAlbum(slug);
  const [active, setActive] = useState<GalleryItem | null>(null);

  if (isLoading) {
    return (
      <PublicPageShell>
        <LoadingSkeleton rows={6} />
      </PublicPageShell>
    );
  }

  if (isError || !album) {
    return (
      <PublicPageShell>
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">{t('gallery.albumNotFound')}</h1>
          <AppButton asChild variant="outline" className="mt-6">
            <Link to="/gallery">{t('gallery.allAlbums')}</Link>
          </AppButton>
        </div>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell>
      <PageContainer className="space-y-8 !px-0 !py-0">
        <div>
          <AppButton asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link to="/gallery">
              <ArrowLeftIcon className="size-4" />
              {t('gallery.allAlbums')}
            </Link>
          </AppButton>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{album.title}</h1>
          {album.description ? (
            <p className="mt-3 max-w-2xl text-muted-foreground">{album.description}</p>
          ) : null}
        </div>

        {album.items.length === 0 ? (
          <p className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            {t('gallery.albumEmpty')}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                className="group overflow-hidden rounded-xl border bg-card text-left shadow-card transition-shadow hover:shadow-elevated"
              >
                {item.mediaType === GALLERY_MEDIA_TYPES.VIDEO ? (
                  <div className="relative aspect-video bg-black">
                    <video src={item.url} className="size-full object-contain" muted />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      <FilmIcon className="size-3.5" />
                      {t('gallery.video')}
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || ''}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                {item.title ? (
                  <p className="truncate p-3 text-sm font-medium">{item.title}</p>
                ) : (
                  <p className="flex items-center gap-1.5 p-3 text-xs text-muted-foreground">
                    <ImageIcon className="size-3.5" />
                    {item.mediaType === GALLERY_MEDIA_TYPES.VIDEO
                      ? t('gallery.video')
                      : t('gallery.photo')}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </PageContainer>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title || t('gallery.mediaPreview')}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={t('gallery.close')}
            onClick={() => setActive(null)}
          >
            <XIcon className="size-5" />
          </button>
          <div
            className="max-h-[90vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {active.mediaType === GALLERY_MEDIA_TYPES.VIDEO ? (
              <video src={active.url} className="max-h-[85vh] w-full" controls autoPlay />
            ) : (
              <img
                src={active.url}
                alt={active.title || ''}
                className="max-h-[85vh] w-full object-contain"
              />
            )}
            {active.title ? (
              <p className="mt-3 text-center text-sm text-white">{active.title}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </PublicPageShell>
  );
}
