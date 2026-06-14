import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
};

export function PageContainer({ children, className, as: Component = 'div' }: PageContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-[var(--width-content-max)] px-[var(--spacing-content-mobile)] md:px-[var(--spacing-content-desktop)]',
        className,
      )}
    >
      {children}
    </Component>
  );
}
