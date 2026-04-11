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
        <p className="text-eyebrow mb-4">{eyebrow}</p>
      )}
      <h2 className="text-headline text-text-primary mb-5">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-text-secondary sm:text-lg leading-relaxed",
            align === "center" && "max-w-2xl mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
