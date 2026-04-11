"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Minimal pill badge — tech tags, status indicators, labels.
 * Designed to recede visually rather than compete with content.
 */
export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  const variants: Record<string, string> = {
    // Neutral — most tech tags
    default:
      "bg-surface-raised border border-border-subtle text-text-secondary",
    // Accent — highlighted categories, interest tags
    accent:
      "bg-[rgba(123,110,246,0.08)] border border-[rgba(123,110,246,0.18)] text-accent-light",
    // Gold — achievements only
    gold:
      "bg-transparent border border-gold/30 text-gold",
    // Status — available, online
    success:
      "bg-transparent border border-success/35 text-success",
    // Minimal — just a border
    outline:
      "bg-transparent border border-border-strong text-text-muted",
  };

  const sizes: Record<string, string> = {
    sm: "px-2.5 py-[3px] text-[0.6875rem] tracking-[0.01em] rounded-md",
    md: "px-3 py-1 text-xs tracking-[0.01em] rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

