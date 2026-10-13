import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "border-border-subtle bg-surface-raised text-text-secondary",
    accent: "border-accent-dim bg-accent-subtle text-accent",
    gold: "border-gold/40 text-gold-light",
    success: "border-success/40 text-success",
    outline: "border-border-subtle text-text-secondary",
  };
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1 rounded-md border font-medium [overflow-wrap:anywhere]", variants[variant], size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm", className)}>
      {children}
    </span>
  );
}
