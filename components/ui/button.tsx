import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-all duration-300 transition-lux focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "rounded-full bg-rose-gold text-ink shadow-[0_14px_30px_-16px_rgba(176,104,113,0.7)] hover:brightness-[1.03] hover:-translate-y-0.5",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-sand",
        outline:
          "rounded-full border border-[#c9a27e]/45 bg-transparent hover:bg-white/70 hover:border-[#c9a27e]",
        ghost: "rounded-full hover:bg-secondary hover:text-foreground",
        danger:
          "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "rounded-sm text-primary underline-offset-4 hover:underline",
        lux: "rounded-full bg-ink text-cream hover:bg-ink/90",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11 rounded-full",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
