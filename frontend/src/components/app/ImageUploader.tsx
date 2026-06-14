import { ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { AppButton } from '@/components/app/AppButton';
import { cn } from '@/lib/utils';

type ImageUploaderProps = {
  label?: string;
  helperText?: string;
  error?: string;
  accept?: string;
  maxSizeMb?: number;
  value?: File | null;
  previewUrl?: string | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
};

function ImageUploader({
  label = 'Upload image',
  helperText,
  error,
  accept = 'image/png,image/jpeg,image/webp,image/gif',
  maxSizeMb = 5,
  value,
  previewUrl,
  onChange,
  disabled,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayPreview = previewUrl ?? localPreview;
  const displayError = error ?? localError;

  const handleFile = useCallback(
    (file: File | null) => {
      setLocalError(null);

      if (!file) {
        setLocalPreview(null);
        onChange?.(null);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setLocalError('Please select a valid image file.');
        return;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        setLocalError(`Image must be smaller than ${maxSizeMb}MB.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      onChange?.(file);
    },
    [maxSizeMb, onChange],
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleFile(file);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const clearImage = () => {
    handleFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5',
          disabled && 'cursor-not-allowed opacity-50',
          displayError && 'border-destructive/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={onInputChange}
        />

        {displayPreview ? (
          <div className="relative w-full max-w-xs">
            <img
              src={displayPreview}
              alt={value?.name ?? 'Uploaded preview'}
              className="mx-auto max-h-40 rounded-lg object-contain"
            />
            {!disabled ? (
              <AppButton
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 size-8 rounded-full bg-background shadow-card"
                onClick={(event) => {
                  event.stopPropagation();
                  clearImage();
                }}
                aria-label="Remove image"
              >
                <XIcon className="size-4" />
              </AppButton>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
              <UploadIcon className="size-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-foreground">Drag and drop an image, or click to browse</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="size-3.5" aria-hidden="true" />
              PNG, JPG, WEBP up to {maxSizeMb}MB
            </p>
          </>
        )}
      </div>

      {helperText && !displayError ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
      {displayError ? (
        <p className="text-xs text-destructive" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}

export { ImageUploader };
