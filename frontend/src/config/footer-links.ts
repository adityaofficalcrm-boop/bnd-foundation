/** Footer quick links — matches bndfoundation.org footer navigation. */
export const FOOTER_QUICK_LINKS = [
  { path: '/', navSlug: 'nav-home', fallbackLabel: 'Home' },
  { path: '/about/history', navSlug: 'nav-about', fallbackLabel: 'About Us' },
  { path: '/donate', navSlug: 'nav-donate', fallbackLabel: 'Donations' },
  { path: '/contact', navSlug: 'nav-contact', fallbackLabel: 'Contact Us' },
  { path: '/team', navSlug: 'nav-team', fallbackLabel: 'Our Teams' },
  { path: '/about/donors', navSlug: 'nav-about-donors', fallbackLabel: 'Our Donors' },
  { path: '/about/history', navSlug: 'nav-about-history', fallbackLabel: 'History' },
  { path: '/about/impact', navSlug: 'nav-about-impact', fallbackLabel: 'Impact' },
  { path: '/projects', navSlug: 'nav-projects', fallbackLabel: 'Current Project' },
  { path: '/campaigns', navSlug: 'nav-campaigns', fallbackLabel: 'Campaigns' },
  { path: '/gallery', navSlug: 'nav-gallery', fallbackLabel: 'Gallery' },
  { path: '/volunteer', navSlug: 'nav-volunteer', fallbackLabel: 'Volunteer' },
] as const;
