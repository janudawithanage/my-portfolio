"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Animate each word separately */
  byWord?: boolean;
  delay?: number;
}

/**
 * Splits text and animates each character or word into view.
 */
export function AnimatedText({
  text,
  className,
  byWord = false,
  delay = 0,
}: AnimatedTextProps) {
  const items = byWord ? text.split(" ") : text.split("");

  return (
    <span className={cn("inline-flex flex-wrap", byWord && "gap-[0.25em]", className)}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * (byWord ? 0.08 : 0.04),
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </span>
  );
}
