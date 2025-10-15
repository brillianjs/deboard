import { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ProxyGroupCard } from "@/components/ProxyGroupCard";
import { fetchProxies } from "@/api/proxies";
import type {
  ProxiesResponse,
  ProxyGroup as ProxyGroupType,
} from "@/api/proxies";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Proxies() {
  const [proxiesData, setProxiesData] = useState<ProxiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProxies = async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProxies();
      setProxiesData(data);
      if (showToast) {
        toast.success("Proxies refreshed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load proxies";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProxies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading proxies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
        <h2 className="text-lg font-semibold text-red-500 mb-2">Error</h2>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => loadProxies(true)}
          className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!proxiesData) {
    return null;
  }

  // Filter proxy groups based on search query
  const proxyGroups = Object.values(proxiesData.proxies).filter(
    (proxy): proxy is ProxyGroupType =>
      proxy.all !== undefined && proxy.all.length > 0
  );

  const filteredGroups = proxyGroups.filter((group) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      (group.all ?? []).some((proxyName: string) =>
        proxyName.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Proxies</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {proxyGroups.length} groups •{" "}
            {Object.keys(proxiesData.proxies).length} proxies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search proxies..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => loadProxies(true)}
            disabled={loading}
            title="Refresh proxies"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No proxies found matching your search"
              : "No proxy groups available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filteredGroups.map((group) => (
            <ProxyGroupCard
              key={group.name}
              group={group}
              proxies={proxiesData.proxies}
              onProxyChange={loadProxies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
