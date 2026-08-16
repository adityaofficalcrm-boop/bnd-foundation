import { Link } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton, LoadingSkeleton } from '@/components/app';
import { usePublicGalleryAlbums } from '@/features/gallery/hooks/useGalleryQueries';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageHero, PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicGalleryPage() {
  const { t } = useTranslation();
  const { data: albums = [], isLoading, isError, refetch } = usePublicGalleryAlbums();

  return (
    <>
      <PublicPageHero
        eyebrow={t('gallery.eyebrow')}
        title={t('gallery.title')}
        description={t('gallery.description')}
      />

      <PublicPageShell>
        <PageContainer className="space-y-8 !px-0 !py-0">
          {isLoading ? (
            <LoadingSkeleton rows={4} />
          ) : isError ? (
            <div className="rounded-xl border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">{t('gallery.loadError')}</p>
              <AppButton variant="outline" className="mt-4" onClick={() => void refetch()}>
                {t('common.tryAgain')}
              </AppButton>
            </div>
          ) : albums.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center shadow-card">
              <ImageIcon className="mx-auto size-10 text-muted-foreground/60" />
              <h2 className="mt-4 text-xl font-semibold">{t('gallery.emptyTitle')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t('gallery.emptyBody')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => {
                const count = album.itemCount ?? 0;

                return (
                  <Link
                    key={album.id}
                    to={`/gallery/${album.slug}`}
                    className="group overflow-hidden rounded-xl border bg-card shadow-card transition-shadow hover:shadow-elevated"
                  >
                    {album.coverImageUrl ? (
                      <img
                        src={album.coverImageUrl}
                        alt=""
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                        <ImageIcon className="size-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="font-semibold text-foreground group-hover:text-primary">
                        {album.title}
                      </h2>
                      {album.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {album.description}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t('gallery.itemCount', { count })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </PageContainer>
      </PublicPageShell>
    </>
  );
}
