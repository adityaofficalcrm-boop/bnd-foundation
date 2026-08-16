import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CmsBodyContentProps = {
  body: string;
  className?: string;
};

/** Supports **bold** markers in CMS plain text. */
function formatInline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-inherit">
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function renderBlock(block: string, index: number) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith('- ') || line.startsWith('* '));

  if (bulletLines.length > 0 && bulletLines.length === lines.length) {
    return (
      <ul key={index} className="list-disc space-y-2 pl-5">
        {bulletLines.map((line) => (
          <li key={line}>{formatInline(line.replace(/^[-*]\s+/, ''))}</li>
        ))}
      </ul>
    );
  }

  return <p key={index}>{formatInline(block)}</p>;
}

export function CmsBodyContent({ body, className }: CmsBodyContentProps) {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4 text-base leading-relaxed text-muted-foreground', className)}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
