import { cn } from '@/lib/utils';

type CmsBodyContentProps = {
  body: string;
  className?: string;
};

export function CmsBodyContent({ body, className }: CmsBodyContentProps) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4 text-base leading-relaxed text-muted-foreground', className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
