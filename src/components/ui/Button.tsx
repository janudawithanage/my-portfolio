"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-200 active:brightness-90 cursor-pointer disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "border border-accent bg-accent text-bg hover:bg-accent-light hover:border-accent-light",
        secondary: "border border-border-subtle bg-surface text-text-primary hover:bg-surface-raised hover:border-border-strong",
        ghost: "text-text-secondary hover:text-accent hover:bg-surface",
        outline: "border border-border-strong text-text-primary hover:border-accent hover:text-accent",
        gold: "border border-gold bg-gold text-bg hover:bg-gold-light",
        link: "text-accent hover:text-accent-light underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-4 py-2",
        md: "px-5 py-2.5",
        lg: "min-h-12 px-6 py-3",
        xl: "min-h-14 px-7 py-3.5 text-base",
        icon: "w-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
