import * as React from "react"
import { cn } from "@/lib/utils/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "info";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-xl border p-4",
        {
          "bg-amber-50 border-amber-200 text-amber-600": variant === "default",
          "bg-red-50 border-red-200 text-red-600": variant === "destructive",
          "bg-green-50 border-green-200 text-green-600": variant === "success",
          "bg-blue-50 border-blue-200 text-blue-600": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`text-sm ${className}`} {...props} />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
