/** Detect CMS entry purpose from slug — drives admin fields and public rendering. */
export type CmsContentKind =
  | 'navigation'
  | 'hero'
  | 'story-intro'
  | 'story-section'
  | 'story-cta'
  | 'donor-intro'
  | 'donor-card'
  | 'team-intro'
  | 'team-member'
  | 'project-intro'
  | 'project-featured'
  | 'grant-card'
  | 'testimonial'
  | 'donate-banner'
  | 'donate-slide'
  | 'facebook-updates'
  | 'partner'
  | 'org-stat'
  | 'fundraise'
  | 'program'
  | 'stat'
  | 'cta'
  | 'contact'
  | 'footer'
  | 'footer-address'
  | 'footer-touch'
  | 'general';

export const PARTNER_GROUPS = [
  { value: 'funding', label: 'Our Funding Bodies' },
  { value: 'community', label: 'Community partners' },
] as const;

export const TEAM_GROUPS = [
  { value: 'board', label: 'Board Members' },
  { value: 'advisors', label: 'Advisors' },
  { value: 'management', label: 'Management' },
  { value: 'nepal-chapter', label: 'Nepal Chapter' },
] as const;

export function getCmsContentKind(slug: string): CmsContentKind {
  if (slug.startsWith('nav-')) return 'navigation';
  if (slug === 'hero') return 'hero';
  if (slug === 'donate-banner') return 'donate-banner';
  if (slug.startsWith('donate-slide-')) return 'donate-slide';
  if (slug === 'facebook-updates') return 'facebook-updates';
  if (slug.endsWith('-cta')) return 'story-cta';
  if (slug === 'donors') return 'donor-intro';
  if (slug === 'donors-hero') return 'general';
  if (slug === 'donors-list-heading') return 'general';
  if (slug === 'donors-cta') return 'story-cta';
  if (slug.startsWith('donor-')) return 'donor-card';
  if (slug === 'about-team') return 'general';
  if (slug === 'team-page') return 'team-intro';
  if (slug === 'team-cta') return 'story-cta';
  if (slug === 'team') return 'general';
  if (slug.startsWith('team-')) return 'team-member';
  if (slug === 'projects-hero') return 'general';
  if (slug === 'projects-grants-heading') return 'general';
  if (slug === 'projects-cta') return 'story-cta';
  if (slug === 'projects') return 'project-intro';
  if (slug.startsWith('project-')) return 'project-featured';
  if (slug.startsWith('grant-')) return 'grant-card';
  if (slug.startsWith('testimonial-')) return 'testimonial';
  if (slug.startsWith('org-stat-')) return 'org-stat';
  if (slug.startsWith('partner-')) return 'partner';
  if (slug.startsWith('fundraise-')) return 'fundraise';
  if (slug.startsWith('program-')) return 'program';
  if (slug.startsWith('stat-')) return 'stat';
  if (slug.startsWith('cta-')) return 'cta';
  if (slug === 'history-hero') return 'general';
  if (slug === 'history-cta') return 'story-cta';
  if (slug === 'impact-hero') return 'general';
  if (slug === 'impact-cta') return 'story-cta';
  if (slug.startsWith('history-') || slug.startsWith('impact-')) return 'story-section';
  if (slug === 'about-hero') return 'general';
  if (slug === 'about-journey-portrait-right') return 'general';
  if (slug === 'about-journey-signature') return 'general';
  if (slug === 'about-journey-resilience') return 'story-section';
  if (slug === 'about-cta') return 'story-cta';
  if (slug.startsWith('about-')) return 'story-section';
  if (slug === 'history' || slug === 'impact' || slug === 'about' || slug === 'home-about') return 'story-intro';
  if (slug.startsWith('contact')) return 'contact';
  if (slug.startsWith('footer-touch-')) return 'footer-touch';
  if (slug.startsWith('address-')) return 'footer-address';
  if (slug.startsWith('footer')) return 'footer';
  return 'general';
}

export function getCmsContentKindLabel(kind: CmsContentKind): string {
  const labels: Record<CmsContentKind, string> = {
    navigation: 'Navigation label only',
    hero: 'Homepage hero',
    'story-intro': 'Page introduction',
    'story-section': 'Story / impact section',
    'story-cta': 'Page donate call-to-action',
    'donor-intro': 'Donors page introduction',
    'donor-card': 'Donor spotlight card',
    'team-intro': 'Team page introduction',
    'team-member': 'Team member profile',
    'project-intro': 'Projects page introduction',
    'project-featured': 'Featured project',
    'grant-card': 'Grant / funding card',
    testimonial: 'Testimonial',
    'donate-banner': 'Homepage donate banner',
    'donate-slide': 'Donate banner slide',
    'facebook-updates': 'Facebook updates section',
    partner: 'Partner logo',
    'org-stat': 'Organisation metric (About mission row + homepage partners bar)',
    fundraise: 'Fundraising highlight',
    program: 'Program card',
    stat: 'Impact statistic',
    cta: 'Call-to-action card',
    contact: 'Contact information',
    footer: 'Footer main (copyright, social links, acknowledgment)',
    'footer-address': 'Office address (Addresses column)',
    'footer-touch': 'Contact location (Get in Touch column)',
    general: 'General content block',
  };
  return labels[kind];
}
