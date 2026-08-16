import { useRef, useState, type ChangeEvent } from 'react';
import { FilmIcon, ImageIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { AppButton, AppInput, ConfirmDialog, toast } from '@/components/app';
import { uploadMedia } from '@/features/cms/api/media.api';
import { uploadGalleryVideo } from '@/features/gallery/api/gallery.api';
import {
  useAddGalleryItem,
  useDeleteGalleryItem,
} from '@/features/gallery/hooks/useGalleryQueries';
import {
  GALLERY_MEDIA_TYPES,
  type GalleryItem,
} from '@/features/gallery/types/gallery.types';
import { getApiErrorMessage } from '@/lib/api-errors';

type GalleryMediaManagerProps = {
  albumId: string;
  items: GalleryItem[];
};

export function GalleryMediaManager({ albumId, items }: GalleryMediaManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const addMutation = useAddGalleryItem(albumId);
  const deleteMutation = useDeleteGalleryItem(albumId);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast.error('Please upload an image (JPEG/PNG/WEBP/GIF) or video (MP4/WEBM).');
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = isVideo ? await uploadGalleryVideo(file) : await uploadMedia(file);
      await addMutation.mutateAsync({
        mediaType: isVideo ? GALLERY_MEDIA_TYPES.VIDEO : GALLERY_MEDIA_TYPES.IMAGE,
        url: uploaded.url,
        title: title.trim() || undefined,
      });
      setTitle('');
      toast.success(isVideo ? 'Video added to album.' : 'Image added to album.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Upload failed.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Media removed.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-card">
      <div>
        <h2 className="text-lg font-semibold">Album media</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload images (up to 5&nbsp;MB) or short videos MP4/WEBM (up to 80&nbsp;MB). Files are stored
          on the server.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <AppInput
            label="Caption (optional)"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Optional title for the next upload"
          />
        </div>
        <AppButton
          type="button"
          variant="primary"
          isLoading={isUploading || addMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="size-4" />
          Upload file
        </AppButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
          onChange={(event) => void handleFileChange(event)}
        />
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No media in this album yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-lg border bg-background">
              {item.mediaType === GALLERY_MEDIA_TYPES.VIDEO ? (
                <video src={item.url} className="aspect-video w-full bg-black object-contain" controls />
              ) : (
                <img src={item.url} alt={item.title || ''} className="aspect-video w-full object-cover" />
              )}
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    {item.mediaType === GALLERY_MEDIA_TYPES.VIDEO ? (
                      <FilmIcon className="size-3.5" />
                    ) : (
                      <ImageIcon className="size-3.5" />
                    )}
                    {item.mediaType === GALLERY_MEDIA_TYPES.VIDEO ? 'Video' : 'Image'}
                  </p>
                  <p className="truncate text-sm font-medium">{item.title || 'Untitled'}</p>
                </div>
                <AppButton
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2Icon className="size-3.5" />
                </AppButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove media?"
        description="This removes the item from the album. The uploaded file may remain on the server."
        confirmLabel="Remove"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
