import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { formatStatDisplay, parseStatValue } from '@/lib/parse-stat-value';

type CountUpStatProps = {
  value: string;
  className?: string;
};

export function CountUpStat({ value, className }: CountUpStatProps) {
  const parsed = parseStatValue(value);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.35 });
  const count = useCountUp({
    target: parsed.value,
    enabled: inView,
    decimals: parsed.decimals,
  });

  return (
    <span ref={ref} className={className}>
      {formatStatDisplay(parsed, count)}
    </span>
  );
}
