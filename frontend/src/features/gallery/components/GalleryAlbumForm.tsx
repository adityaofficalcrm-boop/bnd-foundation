import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, AppSelect, AppTextarea } from '@/components/app';
import { CmsImageField } from '@/features/cms/components/CmsImageField';
import {
  galleryAlbumFormSchema,
  type GalleryAlbumFormValues,
} from '@/features/gallery/schemas/gallery.schema';
import {
  GALLERY_ALBUM_STATUSES,
  GALLERY_ALBUM_STATUS_LABELS,
  type GalleryAlbum,
} from '@/features/gallery/types/gallery.types';

const statusOptions = Object.values(GALLERY_ALBUM_STATUSES).map((value) => ({
  value,
  label: GALLERY_ALBUM_STATUS_LABELS[value],
}));

type GalleryAlbumFormProps = {
  initial?: GalleryAlbum;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: GalleryAlbumFormValues) => Promise<void>;
};

export function GalleryAlbumForm({
  initial,
  submitLabel,
  isSubmitting,
  onSubmit,
}: GalleryAlbumFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryAlbumFormValues>({
    resolver: zodResolver(galleryAlbumFormSchema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      coverImageUrl: initial?.coverImageUrl ?? '',
      status: initial?.status ?? GALLERY_ALBUM_STATUSES.DRAFT,
      sortOrder: initial?.sortOrder ?? 0,
    },
  });

  return (
    <form
      className="space-y-6 rounded-xl border bg-card p-6 shadow-card"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          slug: values.slug?.trim() || undefined,
          description: values.description?.trim() || undefined,
          coverImageUrl: values.coverImageUrl?.trim() || undefined,
        });
      })}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <AppInput label="Title" required error={errors.title?.message} {...register('title')} />
        <AppInput
          label="Slug"
          placeholder="Auto-generated from title if empty"
          error={errors.slug?.message}
          {...register('slug')}
        />
      </div>

      <AppTextarea
        label="Description"
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <AppSelect
              label="Status"
              options={statusOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />
        <AppInput
          label="Sort order"
          type="number"
          step="1"
          error={errors.sortOrder?.message}
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>

      <Controller
        name="coverImageUrl"
        control={control}
        render={({ field }) => (
          <CmsImageField
            label="Cover image"
            value={field.value}
            onChange={field.onChange}
            error={errors.coverImageUrl?.message}
          />
        )}
      />

      <p className="text-xs text-muted-foreground">
        Set status to <strong>Published</strong> to show this album on the public Gallery page.
      </p>

      <AppButton type="submit" variant="primary" isLoading={isSubmitting}>
        {submitLabel}
      </AppButton>
    </form>
  );
}
