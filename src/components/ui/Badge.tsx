import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "border-border bg-white/65 text-text-secondary",
    accent: "border-accent/25 bg-accent-subtle text-accent",
    gold: "border-gold/40 bg-gold-light/70 text-gold-deep",
    success: "border-success/25 bg-success/[.07] text-success",
    outline: "border-border-subtle text-text-secondary",
  };
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full border font-medium [overflow-wrap:anywhere]", variants[variant], size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm", className)}>
      {children}
    </span>
  );
}
