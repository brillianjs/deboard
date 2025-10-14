import * as React from "react";
import { X } from "lucide-react";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined
);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: controlledOpen,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(true),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return <button onClick={() => context.setOpen(true)}>{children}</button>;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({
  children,
  className = "",
}: DialogContentProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  if (!context.open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => context.setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Content */}
      <div
        className={`
          relative z-50 w-full max-w-lg mx-4 
          bg-card border border-border rounded-lg shadow-lg
          animate-in fade-in-0 zoom-in-95 duration-200
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background 
                     transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 
                     focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className = "" }: DialogHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({
  children,
  className = "",
}: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = "" }: DialogFooterProps) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`}
    >
      {children}
    </div>
  );
}
