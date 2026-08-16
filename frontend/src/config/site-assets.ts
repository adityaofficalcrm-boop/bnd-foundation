/** Static asset paths from frontend/public — used when CMS entries omit imageUrl. */
export const SITE_ASSETS = {
  logo: '/logos/Primary-Transparent-Logo-1.png',
  /** Use PNG ≥112px tall for crisp 56px @2x retina rendering. */
  logoWhite: '/logos/Transparent-White-1.png',
  heroPortrait: '/images/Hero.png',
  heroBackground: '/images/pic1.jpg',
  aboutImage: '/images/hajuraama-hq-Large.jpeg',
  acncLogo: '/logos/ACNC-Registered-Charity-Logo.png',
  aboriginalFlag: '/flags/Australian_Aboriginal_Flag.png',
  torresFlag: '/flags/new-pride-flag-01-1-1-1.png',
  australiaFlag: '/flags/Flag_of_Australia.png',
  programs: {
    education: '/images/Education Support.webp',
    maths: '/images/Maths Mentoring.jpg',
    healthcare: '/images/Healthcare & Wellbeing.jpg',
    relief: '/images/Clothing & Food Relief.jpg',
  },
  ctaHelp: '/images/refugees.jpg',
  donateBanner: '/images/Children-Protection.jpg',
} as const;

const PROGRAM_SLUG_MAP: Record<string, string> = {
  'program-education': SITE_ASSETS.programs.education,
  'program-education-support': SITE_ASSETS.programs.education,
  'program-maths': SITE_ASSETS.programs.maths,
  'program-maths-mentoring': SITE_ASSETS.programs.maths,
  'program-healthcare': SITE_ASSETS.programs.healthcare,
  'program-healthcare-wellbeing': SITE_ASSETS.programs.healthcare,
  'program-relief': SITE_ASSETS.programs.relief,
  'program-clothing-food': SITE_ASSETS.programs.relief,
};

export function resolveProgramImage(slug: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  if (PROGRAM_SLUG_MAP[slug]) return PROGRAM_SLUG_MAP[slug];

  const normalized = slug.toLowerCase();
  if (normalized.includes('education')) return SITE_ASSETS.programs.education;
  if (normalized.includes('math')) return SITE_ASSETS.programs.maths;
  if (normalized.includes('health')) return SITE_ASSETS.programs.healthcare;
  if (normalized.includes('relief') || normalized.includes('clothing') || normalized.includes('food')) {
    return SITE_ASSETS.programs.relief;
  }

  return SITE_ASSETS.programs.education;
}

export function resolveHeroImage(imageUrl?: string): string {
  return imageUrl ?? SITE_ASSETS.heroPortrait;
}

export function resolveHeroBackground(imageUrl?: string): string {
  return imageUrl ?? SITE_ASSETS.heroBackground;
}

export function resolveAboutImage(imageUrl?: string): string {
  return imageUrl ?? SITE_ASSETS.aboutImage;
}

export function resolveCtaSectionImage(imageUrl?: string): string {
  return imageUrl ?? SITE_ASSETS.ctaHelp;
}

export function resolveDonateBannerImage(imageUrl?: string): string {
  return imageUrl ?? SITE_ASSETS.donateBanner;
}
