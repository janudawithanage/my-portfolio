"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Minimal pill badge used for tech tags, status indicators, and labels.
 */
export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-surface border border-border text-text-secondary",
    accent:  "bg-accent/15 border border-accent/30 text-accent-light",
    gold:    "bg-gold/15 border border-gold/30 text-gold-light",
    success: "bg-success/15 border border-success/30 text-success",
    outline: "bg-transparent border border-border-light text-text-secondary",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-md whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
