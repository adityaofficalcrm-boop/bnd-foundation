import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { PublicBrandLogo } from '@/components/layout/public/PublicBrandLogo';
import { PublicDonateButton } from '@/components/layout/public/PublicDonateButton';
import { PublicNavMenu } from '@/components/layout/public/PublicNavMenu';
import { usePublicCmsAll } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function PublicHeader() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: pages = [] } = usePublicCmsAll();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary text-primary-foreground shadow-sm">
      <PageContainer className="flex h-14 items-center justify-between gap-3 sm:h-[4.75rem] sm:gap-4">
        <Link to="/" className="flex min-w-0 max-w-[58%] shrink items-center sm:max-w-none">
          <PublicBrandLogo variant="white" priority className="h-10 max-h-10 sm:h-14 sm:max-h-14" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('a11y.mainNav')}>
          <PublicNavMenu pages={pages} variant="desktop" tone="dark" />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <PublicDonateButton
            size="md"
            className="hidden min-h-11 px-5 text-[0.9375rem] lg:inline-flex"
          />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <AppButton
                variant="outline"
                size="icon"
                className="border-white/35 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground lg:hidden"
                aria-label={t('a11y.openMenu')}
              >
                <MenuIcon className="size-4" />
              </AppButton>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-1rem,20rem)] flex-col gap-0 overflow-y-auto p-4 pt-12 sm:w-80"
              title={t('a11y.siteNav')}
              description={t('a11y.siteNavDescription')}
            >
              <div className="mb-4 shrink-0">
                <PublicBrandLogo alt="" className="h-10 max-h-10" />
              </div>
              <nav className="flex min-h-0 flex-1 flex-col" aria-label={t('a11y.mobileNav')}>
                <PublicNavMenu
                  pages={pages}
                  variant="mobile"
                  tone="light"
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
              <PublicDonateButton
                size="lg"
                className="mt-6 w-full shrink-0 py-6 text-base"
                onClick={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
