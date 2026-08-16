import { Link, useNavigate } from 'react-router-dom';
import { AppButton, PageHeader, toast } from '@/components/app';
import { GalleryAlbumForm } from '@/features/gallery/components/GalleryAlbumForm';
import { useCreateGalleryAlbum } from '@/features/gallery/hooks/useGalleryQueries';
import type { GalleryAlbumFormValues } from '@/features/gallery/schemas/gallery.schema';
import { getApiErrorMessage } from '@/lib/api-errors';

export function GalleryAlbumCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateGalleryAlbum();

  const handleSubmit = async (values: GalleryAlbumFormValues) => {
    try {
      const album = await createMutation.mutateAsync(values);
      toast.success('Album created. Add photos or videos next.');
      navigate(`/admin/gallery/${album.id}/edit`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create album.'));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create album"
        description="Add an album, then upload images or short videos."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Gallery', href: '/admin/gallery' },
          { label: 'Create' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/gallery">Back to list</Link>
          </AppButton>
        }
      />

      <GalleryAlbumForm
        submitLabel="Create album"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
