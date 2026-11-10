"use client";

import { useEffect, useRef, useState } from "react";

const numeric = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/;

/**
 * Counts the leading number of a value ("15+", "3.9", "UCSC" stays as is) up from
 * zero once it scrolls into view. The server HTML and reduced-motion users get
 * the final value straight away.
 */
export function CountUp({ value, duration = 1400, delay = 0 }: { value: string; duration?: number; delay?: number }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const match = value.match(numeric);
    const node = ref.current;
    if (!match || !node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, number, suffix] = match;
    const target = Number(number);
    const decimals = number.split(".")[1]?.length ?? 0;
    const format = (amount: number) => prefix + amount.toFixed(decimals) + suffix;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Zero the value before it is revealed, so the count starts from the beginning.
    frame = requestAnimationFrame(() => setDisplay(format(0)));
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => {
        let start = 0;
        const tick = (now: number) => {
          start ||= now;
          const progress = Math.min(1, (now - start) / duration);
          setDisplay(progress < 1 ? format(target * (1 - Math.pow(1 - progress, 4))) : value);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    }, { rootMargin: "0px 0px -8% 0px" });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [value, duration, delay]);

  return <span ref={ref} className="tabular-nums">{display}</span>;
}
