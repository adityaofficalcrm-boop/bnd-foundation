import { ChevronDownIcon } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PUBLIC_NAV_ITEMS,
  type PublicNavDropdownItem,
  type PublicNavLinkItem,
} from '@/config/public-nav';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { cn } from '@/lib/utils';

type PublicNavMenuProps = {
  pages: CmsPublicPage[];
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
  /** Light nav for white backgrounds; dark nav for the teal site header. */
  tone?: 'light' | 'dark';
};

const linkClassName = ({
  isActive,
  variant,
  tone = 'light',
}: {
  isActive: boolean;
  variant: 'desktop' | 'mobile';
  tone?: 'light' | 'dark';
}) =>
  cn(
    variant === 'desktop'
      ? 'rounded-md px-3 py-2 text-sm font-medium transition-colors'
      : 'block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors',
    tone === 'dark'
      ? isActive
        ? 'bg-white/15 text-primary-foreground'
        : 'text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground'
      : isActive
        ? 'bg-primary/10 text-primary'
        : 'text-foreground/80 hover:bg-muted hover:text-primary',
  );

function isAboutPathActive(pathname: string): boolean {
  return pathname === '/about' || pathname.startsWith('/about/');
}

function DesktopNavLink({
  item,
  pages,
  tone,
}: {
  item: PublicNavLinkItem;
  pages: CmsPublicPage[];
  tone: 'light' | 'dark';
}) {
  const label = usePublicNavLabel(pages, item.navSlug, item.fallbackLabel);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => linkClassName({ isActive, variant: 'desktop', tone })}
    >
      {label}
    </NavLink>
  );
}

function DesktopNavDropdown({
  item,
  pages,
  tone,
  pathname,
}: {
  item: PublicNavDropdownItem;
  pages: CmsPublicPage[];
  tone: 'light' | 'dark';
  pathname: string;
}) {
  const { t } = useTranslation();
  const dropdownLabel = usePublicNavLabel(pages, item.navSlug, item.fallbackLabel);
  const aboutActive = isAboutPathActive(pathname);

  return (
    <div className="inline-flex items-center">
      <Link
        to={item.path}
        className={cn(
          'rounded-l-md px-3 py-2 text-sm font-medium transition-colors',
          tone === 'dark'
            ? aboutActive
              ? 'bg-white/15 text-primary-foreground'
              : 'text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground'
            : aboutActive
              ? 'bg-primary/10 text-primary'
              : 'text-foreground/80 hover:bg-muted hover:text-primary',
        )}
      >
        {dropdownLabel}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'inline-flex items-center rounded-r-md px-1.5 py-2 text-sm font-medium transition-colors outline-none',
            tone === 'dark'
              ? aboutActive
                ? 'bg-white/15 text-primary-foreground'
                : 'text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground'
              : aboutActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/80 hover:bg-muted hover:text-primary',
          )}
          aria-label={t('a11y.submenu', { label: dropdownLabel })}
        >
          <ChevronDownIcon className="size-4 opacity-70" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          {item.children.map((child) => (
            <DesktopDropdownChild key={child.path} pages={pages} child={child} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DesktopDropdownChild({
  pages,
  child,
}: {
  pages: CmsPublicPage[];
  child: PublicNavDropdownItem['children'][number];
}) {
  const label = usePublicNavLabel(pages, child.navSlug, child.fallbackLabel);

  return (
    <DropdownMenuItem asChild>
      <Link to={child.path}>{label}</Link>
    </DropdownMenuItem>
  );
}

function MobileNavLink({
  item,
  pages,
  tone,
  onNavigate,
}: {
  item: PublicNavLinkItem;
  pages: CmsPublicPage[];
  tone: 'light' | 'dark';
  onNavigate?: () => void;
}) {
  const label = usePublicNavLabel(pages, item.navSlug, item.fallbackLabel);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onNavigate}
      className={({ isActive }) => linkClassName({ isActive, variant: 'mobile', tone })}
    >
      {label}
    </NavLink>
  );
}

function MobileNavDropdown({
  item,
  pages,
  tone,
  pathname,
  onNavigate,
}: {
  item: PublicNavDropdownItem;
  pages: CmsPublicPage[];
  tone: 'light' | 'dark';
  pathname: string;
  onNavigate?: () => void;
}) {
  const dropdownLabel = usePublicNavLabel(pages, item.navSlug, item.fallbackLabel);

  return (
    <div className="flex w-full flex-col gap-0.5">
      <NavLink
        to={item.path}
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'block w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors',
            isActive || pathname === item.path
              ? tone === 'dark'
                ? 'text-primary-foreground'
                : 'text-primary'
              : tone === 'dark'
                ? 'text-primary-foreground/90'
                : 'text-foreground',
          )
        }
      >
        {dropdownLabel}
      </NavLink>
      <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-border/70 pl-2">
        {item.children.map((child) => (
          <MobileNavChildLink
            key={child.path}
            pages={pages}
            child={child}
            tone={tone}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

function MobileNavChildLink({
  pages,
  child,
  tone,
  onNavigate,
}: {
  pages: CmsPublicPage[];
  child: PublicNavDropdownItem['children'][number];
  tone: 'light' | 'dark';
  onNavigate?: () => void;
}) {
  const label = usePublicNavLabel(pages, child.navSlug, child.fallbackLabel);

  return (
    <NavLink
      to={child.path}
      onClick={onNavigate}
      className={({ isActive }) => linkClassName({ isActive, variant: 'mobile', tone })}
    >
      {label}
    </NavLink>
  );
}

export function PublicNavMenu({ pages, onNavigate, variant = 'desktop', tone = 'light' }: PublicNavMenuProps) {
  const { pathname } = useLocation();

  if (variant === 'mobile') {
    return (
      <div className="flex w-full flex-col gap-0.5">
        {PUBLIC_NAV_ITEMS.map((item) =>
          item.type === 'link' ? (
            <MobileNavLink
              key={item.path}
              item={item}
              pages={pages}
              tone={tone}
              onNavigate={onNavigate}
            />
          ) : (
            <MobileNavDropdown
              key={item.navSlug}
              item={item}
              pages={pages}
              tone={tone}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ),
        )}
      </div>
    );
  }

  return (
    <>
      {PUBLIC_NAV_ITEMS.map((item) =>
        item.type === 'link' ? (
          <DesktopNavLink key={item.path} item={item} pages={pages} tone={tone} />
        ) : (
          <DesktopNavDropdown
            key={item.navSlug}
            item={item}
            pages={pages}
            tone={tone}
            pathname={pathname}
          />
        ),
      )}
    </>
  );
}
