import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { formatPathLabel, PUBLIC_NAV_ITEMS } from '@/config/public-nav';
import { env } from '@/config/env';
import { CMS_SECTIONS, type CmsSection } from '@/features/cms/types/cms.types';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

function getNavLabel(section: CmsSection, pages: { section: CmsSection; title: string }[], path: string) {
  const match = pages.find((page) => page.section === section);
  return match?.title ?? formatPathLabel(path);
}

function NavLinks({ onNavigate, inverted }: { onNavigate?: () => void; inverted?: boolean }) {
  const { data: pages = [] } = usePublicCmsAll();

  return (
    <>
      {PUBLIC_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              inverted
                ? isActive
                  ? 'bg-white/15 text-primary-foreground'
                  : 'text-primary-foreground/85 hover:bg-white/10 hover:text-primary-foreground'
                : isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          {getNavLabel(item.section, pages, item.path)}
        </NavLink>
      ))}
    </>
  );
}

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { data: contactPages = [] } = usePublicCmsSection(CMS_SECTIONS.CONTACT_INFO);
  const contactLabel = contactPages[0]?.title ?? formatPathLabel('/contact');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors',
        isHome
          ? 'border-b border-white/10 bg-primary/95 text-primary-foreground backdrop-blur-md'
          : 'border-b bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80',
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[var(--width-content-max)] items-center justify-between gap-4 px-[var(--spacing-content-mobile)] md:px-[var(--spacing-content-desktop)]">
        <Link
          to="/"
          className={cn(
            'text-lg font-bold tracking-tight',
            isHome ? 'text-primary-foreground' : 'text-primary',
          )}
        >
          {env.VITE_APP_NAME}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <NavLinks inverted={isHome} />
        </nav>

        <div className="flex items-center gap-2">
          <AppButton
            asChild
            variant={isHome ? 'accent' : 'primary'}
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link to="/contact">{contactLabel}</Link>
          </AppButton>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <AppButton
                variant="outline"
                size="icon"
                className={cn('lg:hidden', isHome && 'border-white/25 bg-white/10 text-primary-foreground')}
                aria-label="Open menu"
              >
                <MenuIcon className="size-4" />
              </AppButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile navigation">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </nav>
              <AppButton asChild className="mt-6 w-full">
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  {contactLabel}
                </Link>
              </AppButton>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
