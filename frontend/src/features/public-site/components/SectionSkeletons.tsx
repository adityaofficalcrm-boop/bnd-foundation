import { PageContainer } from '@/features/public-site/components/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-background">
      <PageContainer className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full max-w-xl" />
            <Skeleton className="h-12 w-full max-w-lg" />
            <Skeleton className="h-24 w-full max-w-xl" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
          <Skeleton className="mx-auto aspect-[4/5] w-full max-w-md lg:ml-auto" />
        </div>
      </PageContainer>
    </section>
  );
}

export function CardsSectionSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SplitSectionSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export function StatsSectionSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border bg-card p-6 shadow-card">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="mt-3 h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function GallerySectionSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square w-full rounded-2xl" />
      ))}
    </div>
  );
}
