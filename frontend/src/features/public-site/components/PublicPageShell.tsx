import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/features/public-site/components/PageContainer';

type PublicPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PublicPageHero({ eyebrow, title, description }: PublicPageHeroProps) {
  return (
    <section className="border-b bg-gradient-to-br from-surface via-background to-secondary/5">
      <PageContainer className="py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}

type PublicPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PublicPageShell({ children, className }: PublicPageShellProps) {
  return (
    <PageContainer className={cn('py-10 md:py-14', className)}>
      {children}
    </PageContainer>
  );
}
