export type ParsedStatValue = {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
};

/** Splits CMS stat text like `0 +`, `A$12,975`, or `100+` into animatable parts. */
export function parseStatValue(raw: string): ParsedStatValue {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([^0-9\-+]*?)([\d,]+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { prefix: '', value: 0, suffix: trimmed, decimals: 0 };
  }

  const [, prefix = '', numStr, suffix = ''] = match;
  const normalized = numStr.replace(/,/g, '');
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;

  return {
    prefix,
    value: Number.parseFloat(normalized) || 0,
    suffix,
    decimals,
  };
}

export function formatStatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatStatDisplay(parts: ParsedStatValue, value: number): string {
  return `${parts.prefix}${formatStatNumber(value, parts.decimals)}${parts.suffix}`;
}
