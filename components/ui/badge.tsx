import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primaryBg))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--primaryBg))] text-[hsl(var(--primaryColor))] shadow hover:bg-[hsl(var(--primaryBg)/0.85)]",
        secondary:
          "border-transparent bg-[hsl(var(--secondaryBg))] text-[hsl(var(--secondaryColor))] hover:bg-[hsl(var(--secondaryBg)/0.85)]",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline:
          "border border-[hsl(var(--layoutColor)/0.2)] text-[hsl(var(--layoutColor))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
