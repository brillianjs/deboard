import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ProxyGroup } from "@/components/ProxyGroup";
import { fetchProxies } from "@/api/proxies";
import type {
  ProxiesResponse,
  ProxyGroup as ProxyGroupType,
} from "@/api/proxies";
import { Input } from "./ui/input";

export default function Proxies() {
  const [proxiesData, setProxiesData] = useState<ProxiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProxies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProxies();
      setProxiesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load proxies");
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
          onClick={loadProxies}
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Proxies</h1>
          <p className="text-muted-foreground mt-1">
            {proxyGroups.length} groups •{" "}
            {Object.keys(proxiesData.proxies).length} proxies
          </p>
        </div>
        <div className="relative flex-shrink-0 sm:w-64">
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
      </div>

      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No proxies found matching your search"
                : "No proxy groups available"}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <ProxyGroup
              key={group.name}
              group={group}
              proxies={proxiesData.proxies}
              onProxyChange={loadProxies}
            />
          ))
        )}
      </div>
    </div>
  );
}
