import * as React from "react";
import { createPortal } from "react-dom";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({
  open: controlledOpen,
  onOpenChange,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be used within Popover");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      "data-popover-trigger": "",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        context.setOpen(!context.open);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      data-popover-trigger=""
      onClick={() => context.setOpen(!context.open)}
    >
      {children}
    </button>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}

export function PopoverContent({
  children,
  className = "",
  align = "start",
}: PopoverContentProps) {
  const context = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);

  if (!context) throw new Error("PopoverContent must be used within Popover");

  // Get trigger position
  React.useEffect(() => {
    if (context.open) {
      const trigger = document.querySelector("[data-popover-trigger]");
      if (trigger) {
        setTriggerRect(trigger.getBoundingClientRect());
      }
    }
  }, [context.open]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        const trigger = document.querySelector("[data-popover-trigger]");
        if (trigger && !trigger.contains(event.target as Node)) {
          context.setOpen(false);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [context]);

  if (!context.open || !triggerRect) return null;

  const alignmentStyle: React.CSSProperties = {
    position: "fixed",
    top: triggerRect.bottom + 8,
    left:
      align === "start"
        ? triggerRect.left
        : align === "end"
        ? triggerRect.right - 320
        : triggerRect.left + triggerRect.width / 2 - 160,
    width: "320px",
    zIndex: 9999,
  };

  return createPortal(
    <div
      ref={contentRef}
      style={alignmentStyle}
      className={`
        rounded-lg border border-border bg-popover p-4 shadow-lg
        animate-in fade-in-0 zoom-in-95 duration-200
        ${className}
      `}
    >
      {children}
    </div>,
    document.body
  );
}
