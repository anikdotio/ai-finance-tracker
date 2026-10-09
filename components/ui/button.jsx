import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        cream:
          "bg-[#EAE0D5] text-[#0C0D0E] font-medium hover:bg-[#F3EDE4] transition-colors shadow-sm",
        dark:
          "bg-[#16171B] text-[#F4F0E6] border border-[#26272D] hover:bg-[#1E1F24] transition-colors",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        "destructive-ledger":
          "bg-[#E05A47] text-white font-medium hover:bg-[#D44E3B] transition-colors shadow-sm",
        outline:
          "border border-[#26272D] bg-transparent text-[#F4F0E6] hover:bg-[#1A1B20] hover:text-[#F4F0E6]",
        secondary:
          "bg-[#1C1D22] text-[#F4F0E6] hover:bg-[#25262D]",
        ghost: "text-[#8E8E93] hover:text-[#F4F0E6] hover:bg-[#1A1B20]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
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
