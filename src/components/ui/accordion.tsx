import * as React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = "multiple",
  defaultValue = [],
  children,
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (defaultValue === undefined || defaultValue === "") return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === "single") {
        // For single mode, clicking the same item closes it, clicking another opens that one
        return prev.includes(value) ? [] : [value];
      }
      // For multiple mode, toggle individually
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({
  children,
  className = "",
}: AccordionItemProps) {
  return (
    <div className={`border border-border rounded-lg ${className}`}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionTrigger({
  children,
  value,
  className = "",
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionTrigger must be used within Accordion");

  const isOpen = context.openItems.includes(value);

  return (
    <button
      onClick={() => context.toggleItem(value)}
      className={`
        flex w-full items-center justify-between p-4 text-left
        font-medium transition-all hover:bg-accent/50
        ${className}
      `}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionContent({
  children,
  value,
  className = "",
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionContent must be used within Accordion");

  const isOpen = context.openItems.includes(value);

  return (
    <div
      className={`
        overflow-hidden transition-all duration-200
        ${isOpen ? "max-h-[2000px]" : "max-h-0"}
      `}
    >
      <div className={`p-4 pt-0 ${className}`}>{children}</div>
    </div>
  );
}
