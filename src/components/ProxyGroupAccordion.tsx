import { useState } from "react";
import { Check, Zap } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { switchProxy, testProxyDelay } from "@/api/proxies";
import type { ProxyGroup as ProxyGroupType, Proxy } from "@/api/proxies";
import { Button } from "@/components/ui/button";

interface ProxyGroupAccordionProps {
  group: ProxyGroupType;
  proxies: Record<string, Proxy | ProxyGroupType>;
  onProxyChange: () => void;
}

export function ProxyGroupAccordion({
  group,
  proxies,
  onProxyChange,
}: ProxyGroupAccordionProps) {
  const [testingProxies, setTestingProxies] = useState<Set<string>>(new Set());
  const [switchingProxy, setSwitchingProxy] = useState<string | null>(null);

  const handleProxySelect = async (proxyName: string) => {
    if (proxyName === group.now || switchingProxy) return;

    setSwitchingProxy(proxyName);
    try {
      await switchProxy(group.name, proxyName);
      // Update state tanpa refresh
      onProxyChange();
    } catch (error) {
      console.error("Failed to switch proxy:", error);
    } finally {
      setSwitchingProxy(null);
    }
  };

  const handleTestDelay = async (proxyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (testingProxies.has(proxyName)) return;

    setTestingProxies((prev) => new Set(prev).add(proxyName));

    try {
      await testProxyDelay(proxyName);
      // Update state tanpa refresh
      onProxyChange();
    } catch (error) {
      console.error("Failed to test proxy delay:", error);
    } finally {
      setTestingProxies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(proxyName);
        return newSet;
      });
    }
  };

  const getProxyDelay = (proxyName: string): number | undefined => {
    const proxy = proxies[proxyName];
    if (!proxy || !proxy.history || proxy.history.length === 0)
      return undefined;
    return proxy.history[proxy.history.length - 1]?.delay;
  };

  const getProxyType = (proxyName: string): string => {
    const proxy = proxies[proxyName];
    return proxy?.type ?? "Unknown";
  };

  const getDelayColor = (delay?: number) => {
    if (!delay || delay === 0) return "text-muted-foreground";
    if (delay < 200) return "text-green-500";
    if (delay < 500) return "text-yellow-500";
    return "text-red-500";
  };

  const currentProxy = group.now;
  const currentDelay = getProxyDelay(currentProxy);

  return (
    <>
      <AccordionItem value={group.name}>
        <AccordionTrigger value={group.name}>
          <div className="flex flex-col gap-2 w-full pr-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">{group.name}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                  {group.type}
                </span>
              </div>
              {/* Delay badge - pojok kanan */}
              {currentDelay && (
                <span
                  className={`${getDelayColor(
                    currentDelay
                  )} text-[10px] font-medium px-1.5 py-0.5 rounded opacity-70`}
                >
                  {currentDelay}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-left">
              <span className="text-muted-foreground text-xs">Current:</span>
              <span className="font-medium text-xs truncate max-w-[150px]">
                {currentProxy}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent value={group.name}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {group.all.map((proxyName) => {
              const delay = getProxyDelay(proxyName);
              const isSelected = group.now === proxyName;
              const isTesting = testingProxies.has(proxyName);
              const isSwitching = switchingProxy === proxyName;

              return (
                <div
                  key={proxyName}
                  className={`
                    relative flex items-center gap-2 p-2 rounded-md
                    transition-all duration-200 text-sm
                    ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : isSwitching
                        ? "bg-accent border border-primary/20 cursor-wait"
                        : "hover:bg-accent/50 border border-transparent cursor-pointer"
                    }
                    ${isSelected ? "" : "hover:border-primary/20"}
                  `}
                  onClick={() =>
                    !isSelected && !isSwitching && handleProxySelect(proxyName)
                  }
                  title={
                    isSelected
                      ? "Currently active"
                      : isSwitching
                      ? "Switching..."
                      : "Click to switch"
                  }
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    )}
                    {isSwitching && (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-medium truncate text-sm ${
                          isSwitching ? "opacity-50" : ""
                        }`}
                      >
                        {proxyName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          {getProxyType(proxyName)}
                        </span>
                        {delay !== undefined && delay > 0 && (
                          <span
                            className={`text-[10px] font-medium ${getDelayColor(
                              delay
                            )}`}
                          >
                            {delay}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleTestDelay(proxyName, e)}
                      disabled={isTesting || isSwitching}
                      className="h-7 w-7 p-0"
                      title="Test latency"
                    >
                      <Zap
                        className={`h-3.5 w-3.5 ${
                          isTesting ? "animate-pulse text-primary" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
