type TeamFamilyPhotoProps = {
  imageUrl: string;
  caption?: string | null;
};

export function TeamFamilyPhoto({ imageUrl, caption }: TeamFamilyPhotoProps) {
  return (
    <figure className="mx-auto max-w-5xl text-center">
      <img
        src={imageUrl}
        alt={caption?.trim() || 'The Foundation team'}
        className="mx-auto max-h-[min(70vh,640px)] w-full max-w-full object-cover"
        loading="lazy"
      />
      {caption?.trim() ? (
        <figcaption className="mt-4 text-lg font-bold tracking-tight text-foreground md:text-xl">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
