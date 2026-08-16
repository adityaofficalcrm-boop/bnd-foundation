/** Google Maps search URL for a plain-text address (opens in a new tab). */
export function buildGoogleMapsSearchUrl(address: string): string {
  const query = address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Embed URL for an iframe map generated from a plain-text address. */
export function buildGoogleMapsEmbedUrl(address: string): string {
  const query = address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** Prefer an explicit Maps URL from CMS; otherwise search by address text. */
export function resolveGoogleMapsUrl(address: string, mapsUrl?: string | null): string {
  const custom = mapsUrl?.trim();
  if (custom) {
    return custom;
  }

  return buildGoogleMapsSearchUrl(address);
}

export function resolveGoogleMapsEmbedUrl(address: string, mapsUrl?: string | null): string | null {
  const custom = mapsUrl?.trim();
  if (!custom && !address.trim()) {
    return null;
  }

  if (custom && custom.includes('google.com/maps/embed')) {
    return custom;
  }

  if (custom) {
    return custom;
  }

  return buildGoogleMapsEmbedUrl(address);
}
