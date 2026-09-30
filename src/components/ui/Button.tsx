"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // ── Base ────────────────────────────────────────────────────────────────────
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold tracking-[0.01em] rounded-xl",
    "transition-all duration-250",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Filled gradient — primary CTAs
        primary: [
          "bg-linear-to-br from-accent-light via-accent to-accent-dim text-[#07121E]",
          "border border-white/35 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_24px_rgba(54,161,222,0.24)]",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_12px_34px_rgba(54,161,222,0.38)] hover:-translate-y-0.5",
          "active:brightness-90 active:scale-[0.99]",
        ].join(" "),

        // Outlined surface — secondary CTAs
        secondary: [
          "glass-light text-text-primary",
          "border border-border-subtle",
          "hover:border-accent/40 hover:bg-surface-raised hover:text-accent-light",
          "active:brightness-90 active:scale-[0.99]",
        ].join(" "),

        // Borderless — tertiary / in-line
        ghost: [
          "text-text-secondary hover:text-text-primary hover:bg-surface-raised",
          "active:brightness-90",
        ].join(" "),

        // Explicit accent border — empty-state CTAs
        outline: [
          "border border-accent/40 text-accent-light",
          "hover:bg-accent/10 hover:border-accent",
          "active:brightness-90 active:scale-[0.99]",
        ].join(" "),

        // Achievement highlights only
        gold: [
          "bg-linear-to-br from-gold-light via-gold to-[#B38C53] text-[#07121E] font-bold border border-white/35",
          "shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_24px_rgba(217,183,122,0.24)]",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_12px_34px_rgba(217,183,122,0.38)] hover:-translate-y-0.5",
          "active:brightness-90 active:scale-[0.99]",
        ].join(" "),

        // Inline text links
        link: "text-accent hover:text-accent-light underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        sm:   "px-4 py-2 text-xs h-8",
        md:   "px-5 py-2.5 text-sm h-9",
        lg:   "px-7 py-3.5 text-sm h-11",
        xl:   "px-9 py-4 text-base h-14",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
