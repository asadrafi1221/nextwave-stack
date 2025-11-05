"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[hsl(var(--primaryColor)/0.2)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondaryBg))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--layoutBg))] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[hsl(var(--secondaryBg))] data-[state=unchecked]:bg-[hsl(var(--primaryBg))]",
      className
    )}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-[hsl(var(--primaryColor))] shadow-md ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
