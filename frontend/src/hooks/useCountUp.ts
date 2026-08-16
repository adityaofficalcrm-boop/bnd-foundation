import { useEffect, useState } from 'react';

type UseCountUpOptions = {
  target: number;
  duration?: number;
  enabled?: boolean;
  decimals?: number;
};

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

export function useCountUp({
  target,
  duration = 1800,
  enabled = false,
  decimals = 0,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || duration <= 0) {
      setValue(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = target * easeOutCubic(progress);
      const factor = 10 ** decimals;
      setValue(Math.round(next * factor) / factor);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [decimals, duration, enabled, target]);

  return value;
}
