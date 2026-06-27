import { useEffect, useRef, useState } from "react";

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// Convert "٣+" / "+50" / "98%" → { prefix, number, suffix, arabic }
function parseTarget(raw: string) {
  // Detect Arabic-Indic digits
  const arabic = /[٠-٩]/.test(raw);
  const western = raw.replace(/[٠-٩]/g, d => String(AR_DIGITS.indexOf(d)));
  const match = western.match(/(\D*)(\d+)(\D*)/);
  if (!match) return { prefix: raw, number: 0, suffix: "", arabic, hasNumber: false };
  return { prefix: match[1], number: parseInt(match[2], 10), suffix: match[3], arabic, hasNumber: true };
}

function toArabic(n: number) {
  return String(n).replace(/\d/g, d => AR_DIGITS[+d]);
}

/**
 * Animate a number from 0 → target once the element scrolls into view.
 * Accepts the same display string used elsewhere (e.g. "+50", "98%", "٣+").
 */
export function useCountUp(target: string, duration = 1600) {
  const { prefix, number, suffix, arabic, hasNumber } = parseTarget(target);
  const [display, setDisplay] = useState(hasNumber ? `${prefix}${arabic ? toArabic(0) : 0}${suffix}` : target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!hasNumber) { setDisplay(target); return; }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            // easeOutExpo
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            const current = Math.round(eased * number);
            setDisplay(`${prefix}${arabic ? toArabic(current) : current}${suffix}`);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, number, prefix, suffix, arabic, hasNumber, duration]);

  return { ref, display };
}
