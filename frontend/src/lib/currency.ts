const AUD_FORMATTER = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function formatAudFromCents(amountCents: number): string {
  return AUD_FORMATTER.format(amountCents / 100);
}

export function formatAud(amountDollars: number): string {
  return AUD_FORMATTER.format(amountDollars);
}
