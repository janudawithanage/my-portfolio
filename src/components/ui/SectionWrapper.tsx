"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeUp } from "@/lib/motion";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Extra delay before stagger begins */
  delay?: number;
}

/**
 * Wraps every section with scroll-triggered entrance animations and
 * consistent vertical padding.
 */
export function SectionWrapper({
  id,
  className,
  children,
  delay = 0,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0.12, delay)}
      className={cn("section-padding px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </motion.section>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/10 text-accent border border-accent/20 mb-4">
          {eyebrow}
        </span>
      )}
      <h2
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
        style={{ fontFamily: "var(--font-syne, sans-serif)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
