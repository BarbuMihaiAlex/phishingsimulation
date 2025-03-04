
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const indicatorVariants = cva(
  "absolute inline-flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-500 text-white",
      },
      size: {
        default: "h-5 w-5 text-xs",
        sm: "h-3 w-3",
        lg: "h-6 w-6",
      },
      position: {
        "top-right": "-top-1 -right-1",
        "top-left": "-top-1 -left-1",
        "bottom-right": "-bottom-1 -right-1", 
        "bottom-left": "-bottom-1 -left-1",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      position: "top-right"
    },
  }
)

export interface BadgeIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof indicatorVariants> {}

function BadgeIndicator({
  className,
  variant,
  size,
  position,
  ...props
}: BadgeIndicatorProps) {
  return (
    <div
      className={cn(indicatorVariants({ variant, size, position, className }))}
      {...props}
    />
  )
}

export { BadgeIndicator }
