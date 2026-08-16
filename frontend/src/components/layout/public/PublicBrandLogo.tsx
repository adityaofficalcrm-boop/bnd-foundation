import { SITE_ASSETS } from '@/config/site-assets';
import { env } from '@/config/env';
import { cn } from '@/lib/utils';

/** Rendered logo height (px). Source assets should be ≥2× this for sharp retina display. */
export const BRAND_LOGO_HEIGHT_PX = 56;

type PublicBrandLogoProps = {
  variant?: 'default' | 'white';
  className?: string;
  /** Decorative instances should pass an empty alt via aria-hidden on a wrapper. */
  alt?: string;
  priority?: boolean;
};

export function PublicBrandLogo({
  variant = 'default',
  className,
  alt,
  priority = false,
}: PublicBrandLogoProps) {
  const src = variant === 'white' ? SITE_ASSETS.logoWhite : SITE_ASSETS.logo;
  const altText = alt ?? (variant === 'default' ? env.VITE_APP_NAME : '');

  return (
    <img
      src={src}
      alt={altText}
      height={BRAND_LOGO_HEIGHT_PX}
      className={cn(
        'h-12 w-auto min-h-[48px] max-h-14 shrink-0 object-contain object-left sm:h-14',
        className,
      )}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
    />
  );
}
