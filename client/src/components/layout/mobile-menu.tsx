import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const MobileMenu = DialogPrimitive.Root

const MobileMenuTrigger = DialogPrimitive.Trigger

const MobileMenuPortal = DialogPrimitive.Portal

const MobileMenuOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
MobileMenuOverlay.displayName = DialogPrimitive.Overlay.displayName

const MobileMenuContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <MobileMenuPortal>
    <MobileMenuOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-0 top-16 z-50 w-full bg-background p-6 shadow-extruded transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4 duration-300",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">Navigation Menu</DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </MobileMenuPortal>
))
MobileMenuContent.displayName = DialogPrimitive.Content.displayName

export {
  MobileMenu,
  MobileMenuPortal,
  MobileMenuOverlay,
  MobileMenuTrigger,
  MobileMenuContent,
}
