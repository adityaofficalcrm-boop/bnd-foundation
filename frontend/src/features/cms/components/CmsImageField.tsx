import { uploadMedia } from '@/features/cms/api/media.api';
import { AppInput } from '@/components/app/AppInput';
import { ImageUploader } from '@/components/app/ImageUploader';
import { getApiErrorMessage } from '@/lib/api-errors';
import { toast } from '@/components/app/AppToaster';
import { useState } from 'react';

type CmsImageFieldProps = {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  helperText?: string;
};

export function CmsImageField({
  label = 'Image',
  value = '',
  onChange,
  error,
  helperText = 'Upload an image or paste an external URL.',
}: CmsImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) {
      onChange('');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadMedia(file);
      onChange(result.url);
      toast.success('Image uploaded successfully.');
    } catch (uploadError) {
      toast.error(getApiErrorMessage(uploadError, 'Failed to upload image.'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <ImageUploader
        label={label}
        helperText={helperText}
        error={error}
        previewUrl={value || null}
        disabled={isUploading}
        onChange={(file) => void handleUpload(file)}
      />
      <AppInput
        label="Or image URL"
        placeholder="https://example.org/image.jpg"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
        disabled={isUploading}
      />
    </div>
  );
}
