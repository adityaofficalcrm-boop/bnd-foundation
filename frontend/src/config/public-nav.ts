export const NAV_SLUGS = {
  home: 'nav-home',
  about: 'nav-about',
  contact: 'nav-contact',
  team: 'nav-team',
  aboutHistory: 'nav-about-history',
  aboutDonors: 'nav-about-donors',
  aboutImpact: 'nav-about-impact',
  projects: 'nav-projects',
  campaigns: 'nav-campaigns',
  gallery: 'nav-gallery',
  volunteer: 'nav-volunteer',
} as const;

export type PublicNavChild = {
  path: string;
  navSlug: string;
  fallbackLabel: string;
};

export type PublicNavLinkItem = {
  type: 'link';
  path: string;
  navSlug: string;
  fallbackLabel: string;
};

export type PublicNavDropdownItem = {
  type: 'dropdown';
  navSlug: string;
  fallbackLabel: string;
  /** Landing page when the parent label is clicked (e.g. /about → old site /about-us/) */
  path: string;
  children: PublicNavChild[];
};

export type PublicNavItem = PublicNavLinkItem | PublicNavDropdownItem;

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  {
    type: 'link',
    path: '/',
    navSlug: NAV_SLUGS.home,
    fallbackLabel: 'Home',
  },
  {
    type: 'dropdown',
    navSlug: NAV_SLUGS.about,
    fallbackLabel: 'About Us',
    path: '/about',
    children: [
      {
        path: '/about/history',
        navSlug: NAV_SLUGS.aboutHistory,
        fallbackLabel: 'Our History',
      },
      {
        path: '/about/donors',
        navSlug: NAV_SLUGS.aboutDonors,
        fallbackLabel: 'Our Donors',
      },
      {
        path: '/about/impact',
        navSlug: NAV_SLUGS.aboutImpact,
        fallbackLabel: 'Our Impact',
      },
    ],
  },
  {
    type: 'link',
    path: '/team',
    navSlug: NAV_SLUGS.team,
    fallbackLabel: 'Our Team',
  },
  {
    type: 'link',
    path: '/projects',
    navSlug: NAV_SLUGS.projects,
    fallbackLabel: 'Current Projects',
  },
  {
    type: 'link',
    path: '/campaigns',
    navSlug: NAV_SLUGS.campaigns,
    fallbackLabel: 'Campaigns',
  },
  {
    type: 'link',
    path: '/gallery',
    navSlug: NAV_SLUGS.gallery,
    fallbackLabel: 'Gallery',
  },
  {
    type: 'link',
    path: '/volunteer',
    navSlug: NAV_SLUGS.volunteer,
    fallbackLabel: 'Volunteer',
  },
  {
    type: 'link',
    path: '/contact',
    navSlug: NAV_SLUGS.contact,
    fallbackLabel: 'Contact Us',
  },
];

/** About sub-pages — content slugs in CMS (not nav-* slugs). */
export const ABOUT_SUBPAGE_SLUGS = ['history', 'donors', 'impact'] as const;

export type AboutSubpageSlug = (typeof ABOUT_SUBPAGE_SLUGS)[number];

export function isAboutSubpageSlug(slug: string): slug is AboutSubpageSlug {
  return (ABOUT_SUBPAGE_SLUGS as readonly string[]).includes(slug);
}

export function formatPathLabel(path: string): string {
  const segment = path === '/' ? 'home' : path.replace(/^\//, '');
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function flattenPublicNavLinks(): PublicNavChild[] {
  return PUBLIC_NAV_ITEMS.flatMap((item) =>
    item.type === 'link'
      ? [{ path: item.path, navSlug: item.navSlug, fallbackLabel: item.fallbackLabel }]
      : item.children,
  );
}
