import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/features/public-site/components/PageContainer';

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  variant?: 'default' | 'muted' | 'primary';
  animate?: boolean;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
  variant = 'default',
  animate = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-14 md:py-20',
        variant === 'muted' && 'bg-surface',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        animate && 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700',
        className,
      )}
    >
      <PageContainer className={containerClassName}>
        {(eyebrow || title || description) && (
          <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            {eyebrow ? (
              <p
                className={cn(
                  'text-xs font-semibold tracking-[0.2em] uppercase',
                  variant === 'primary' ? 'text-primary-foreground/80' : 'text-secondary',
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  'mt-3 text-3xl font-bold tracking-tight md:text-4xl',
                  variant === 'primary' ? 'text-primary-foreground' : 'text-foreground',
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  'mt-4 text-base leading-relaxed md:text-lg',
                  variant === 'primary' ? 'text-primary-foreground/90' : 'text-muted-foreground',
                )}
              >
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </PageContainer>
    </section>
  );
}
