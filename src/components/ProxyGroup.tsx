import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProxyItem } from "./ProxyItem";
import { switchProxy, testProxyDelay } from "@/api/proxies";
import type { ProxyGroup as ProxyGroupType, Proxy } from "@/api/proxies";

interface ProxyGroupProps {
  group: ProxyGroupType;
  proxies: Record<string, Proxy | ProxyGroupType>;
  onProxyChange: () => void;
}

export function ProxyGroup({ group, proxies, onProxyChange }: ProxyGroupProps) {
  const [testingProxies, setTestingProxies] = useState<Set<string>>(new Set());

  const handleProxySelect = async (proxyName: string) => {
    if (proxyName === group.now) return;

    try {
      await switchProxy(group.name, proxyName);
      onProxyChange();
    } catch (error) {
      console.error("Failed to switch proxy:", error);
    }
  };

  const handleTestDelay = async (proxyName: string) => {
    if (testingProxies.has(proxyName)) return;

    setTestingProxies((prev) => new Set(prev).add(proxyName));

    try {
      await testProxyDelay(proxyName);
      onProxyChange(); // Refresh to get updated delay
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

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
              {group.type}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {group.all.map((proxyName) => {
            const proxy = proxies[proxyName];
            if (!proxy) return null;

            return (
              <ProxyItem
                key={proxyName}
                name={proxyName}
                type={getProxyType(proxyName)}
                delay={getProxyDelay(proxyName)}
                isSelected={group.now === proxyName}
                onClick={() => handleProxySelect(proxyName)}
                onTest={() => handleTestDelay(proxyName)}
                isTesting={testingProxies.has(proxyName)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
