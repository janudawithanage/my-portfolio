"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[color,background-color,border-color,box-shadow] duration-300 active:brightness-95 cursor-pointer disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "btn-primary border border-ink bg-ink text-white hover:border-accent",
        secondary: "btn-secondary border border-border bg-white/60 text-ink hover:border-border-subtle",
        ghost: "text-text-secondary hover:text-accent hover:bg-white/60",
        outline: "border border-border-strong bg-white/40 text-ink hover:border-accent hover:text-accent",
        gold: "border border-gold/50 bg-gold-light text-gold-deep hover:border-gold",
        link: "text-accent underline-offset-4 hover:underline",
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
  /** Gently follow the pointer (fine pointers only; off for reduced motion). */
  magnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...(magnetic ? { "data-magnetic": "" } : {})} {...props} />;
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
