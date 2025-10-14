import { Check, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProxyItemProps {
  name: string;
  type: string;
  delay?: number;
  isSelected: boolean;
  onClick: () => void;
  onTest: () => void;
  isTesting: boolean;
}

export function ProxyItem({
  name,
  type,
  delay,
  isSelected,
  onClick,
  onTest,
  isTesting,
}: ProxyItemProps) {
  const getDelayColor = (delay?: number) => {
    if (!delay || delay === 0) return "text-muted-foreground";
    if (delay < 200) return "text-green-500";
    if (delay < 500) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card
      className={`
        relative p-3 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{name}</span>
            {isSelected && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="px-2 py-0.5 rounded bg-muted">{type}</span>
            {delay !== undefined && delay > 0 && (
              <span className={getDelayColor(delay)}>{delay}ms</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTest();
          }}
          disabled={isTesting}
          className={`
            p-2 rounded-lg transition-colors
            ${
              isTesting
                ? "text-muted-foreground cursor-not-allowed"
                : "text-foreground hover:bg-accent"
            }
          `}
        >
          <Zap className={`h-4 w-4 ${isTesting ? "animate-pulse" : ""}`} />
        </button>
      </div>
    </Card>
  );
}
