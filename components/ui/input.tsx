import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        {...props}
        className={cn(
          "flex h-9 w-full rounded-md border border-[hsl(var(--primaryColor)/0.3)] bg-[hsl(var(--primaryBg))] text-[hsl(var(--primaryColor))] placeholder:text-[hsl(var(--primaryColor)/0.6)] shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primaryColor))] focus-visible:border-[hsl(var(--primaryColor))] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
