"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

const ITEMS = [
  "Full-Stack Development",
  "Cloud Engineering",
  "Cybersecurity",
  "React / Next.js",
  "Microsoft Azure",
  "API Design",
  "DevOps & CI/CD",
  "Security Research",
  "TypeScript",
  "System Design",
];

function Strip({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="marquee-row" aria-hidden={reverse || undefined}>
      <div className={`marquee-track${reverse ? " marquee-track-reverse" : ""}`}>
        {[0, 1].map(copy => (
          <ul key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined} role="list">
            {ITEMS.map(item => (
              <li
                key={item}
                className="marquee-chip inline-flex shrink-0 items-center gap-2.5 px-5 py-2 rounded-full
                  border border-border-subtle bg-surface text-text-muted text-sm font-medium
                  hover:border-accent/30 hover:text-text-secondary transition-colors cursor-default select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function MarqueeStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="marquee-section"
      aria-label="Skills marquee"
      data-paused={paused}
    >
      <div className="marquee-content">
        <Strip />
        <Strip reverse />
      </div>
      <div className="container-section marquee-controls">
        <button
          type="button"
          onClick={() => setPaused(value => !value)}
          className="muted-link inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs"
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          {paused ? "Resume scrolling" : "Pause scrolling"}
        </button>
      </div>
    </section>
  );
}
