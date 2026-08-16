import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppButton, LoadingSkeleton, PageHeader, toast } from '@/components/app';
import { GalleryAlbumForm } from '@/features/gallery/components/GalleryAlbumForm';
import { GalleryMediaManager } from '@/features/gallery/components/GalleryMediaManager';
import {
  useGalleryAlbum,
  useUpdateGalleryAlbum,
} from '@/features/gallery/hooks/useGalleryQueries';
import type { GalleryAlbumFormValues } from '@/features/gallery/schemas/gallery.schema';
import { getApiErrorMessage } from '@/lib/api-errors';

export function GalleryAlbumEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: album, isLoading, isError } = useGalleryAlbum(id);
  const updateMutation = useUpdateGalleryAlbum();

  const handleSubmit = async (values: GalleryAlbumFormValues) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, payload: values });
      toast.success('Album updated.');
      navigate('/admin/gallery');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update album.'));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit album"
        description="Update album details and manage photos / videos."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Gallery', href: '/admin/gallery' },
          { label: 'Edit' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/gallery">Back to list</Link>
          </AppButton>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : isError || !album ? (
        <p className="text-sm text-destructive">Unable to load this album.</p>
      ) : (
        <div className="space-y-8">
          <GalleryAlbumForm
            initial={album}
            submitLabel="Save album"
            isSubmitting={updateMutation.isPending}
            onSubmit={handleSubmit}
          />
          <GalleryMediaManager albumId={album.id} items={album.items} />
        </div>
      )}
    </div>
  );
}
