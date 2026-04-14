"use client";

import { motion } from "framer-motion";

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
  const items = [...ITEMS, ...ITEMS]; // doubled for seamless loop
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex gap-6 shrink-0"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full
              border border-border-subtle bg-surface text-text-muted text-sm font-medium
              hover:border-accent/30 hover:text-text-secondary transition-colors cursor-default select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <section
      className="py-10 border-y border-border overflow-hidden bg-bg-secondary"
      aria-label="Skills marquee"
    >
      <div className="flex flex-col gap-4">
        <Strip />
        <Strip reverse />
      </div>
    </section>
  );
}
