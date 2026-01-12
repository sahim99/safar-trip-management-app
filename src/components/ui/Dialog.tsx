import React from 'react'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'

// Simplified Dialog for this project without heavy Radix UI dependency for now
// In a real large app, we'd use Radix UI Primitives

export const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => onOpenChange?.(false)}>{children}</div>
}

export const DialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg animate-in zoom-in-95 duration-200", className)} onClick={(e) => e.stopPropagation()} {...props}>
    {children}
  </div>
)

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
)

export const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
)
