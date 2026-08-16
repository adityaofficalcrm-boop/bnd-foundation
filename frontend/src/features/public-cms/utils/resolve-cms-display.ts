type CmsTextFields = {
  title?: string;
  heading?: string;
  subheading?: string;
  body?: string;
};

function text(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export type ResolvedCmsDisplay = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

/** Maps CMS text fields to section header slots without repeating the same copy. */
export function resolveCmsSectionDisplay(entry?: CmsTextFields | null): ResolvedCmsDisplay {
  if (!entry) {
    return {};
  }

  const title = text(entry.title);
  const heading = text(entry.heading);
  const subheading = text(entry.subheading);
  const body = text(entry.body);

  const primaryTitle = title ?? heading;
  const eyebrow = title && heading && heading !== title ? heading : undefined;
  const description = subheading ?? (!primaryTitle ? body : undefined);

  return {
    eyebrow,
    title: primaryTitle,
    description: description && description !== primaryTitle ? description : undefined,
  };
}

export function resolveCmsHeroDisplay(entry: CmsTextFields & { slug?: string }): {
  eyebrow?: string;
  title?: string;
  subheading?: string;
} {
  const heading = text(entry.heading);
  const subheading = text(entry.subheading);

  // Title is for admin/nav labels — public hero uses heading + subheading only.
  return {
    eyebrow: heading,
    title: subheading,
    subheading: undefined,
  };
}

export function resolveCmsHeroImageAlt(entry: CmsTextFields & { slug?: string }): string {
  return text(entry.heading) ?? text(entry.subheading) ?? entry.slug ?? 'Hero image';
}
