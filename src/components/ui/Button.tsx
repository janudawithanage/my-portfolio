"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent-light shadow-lg hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] active:scale-[0.98]",
        secondary:
          "bg-surface border border-border text-text-primary hover:border-accent hover:text-accent-light hover:bg-surface-hover active:scale-[0.98]",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-surface active:scale-[0.98]",
        outline:
          "border border-accent text-accent hover:bg-accent hover:text-white active:scale-[0.98]",
        gold:
          "bg-gold text-bg font-bold hover:bg-gold-light shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-[0.98]",
        link:
          "text-accent underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm:  "px-4 py-2 text-sm",
        md:  "px-6 py-3 text-sm",
        lg:  "px-8 py-4 text-base",
        xl:  "px-10 py-5 text-lg",
        icon: "h-10 w-10 p-0",
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
