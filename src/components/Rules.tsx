import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import {
  fetchRules,
  fetchRuleProviders,
  updateRuleProvider,
  updateAllRuleProviders,
  type Rule,
  type RuleProvider,
} from "@/api/rules";

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [providers, setProviders] = useState<{
    byName: Record<string, RuleProvider>;
    names: string[];
  }>({ byName: {}, names: [] });
  const [filterText, setFilterText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingProvider, setRefreshingProvider] = useState<string | null>(
    null
  );

  // Load initial data
  useEffect(() => {
    loadRules();
    loadProviders();
  }, []);

  const loadRules = async () => {
    const data = await fetchRules();
    setRules(data);
  };

  const loadProviders = async () => {
    const data = await fetchRuleProviders();
    setProviders(data);
  };

  const handleRefreshProvider = async (name: string) => {
    setRefreshingProvider(name);
    await updateRuleProvider(name);
    await loadProviders();
    setRefreshingProvider(null);
  };

  const handleRefreshAllProviders = async () => {
    setIsRefreshing(true);
    await updateAllRuleProviders(providers.names);
    await loadProviders();
    setIsRefreshing(false);
  };

  // Filter rules
  const filteredRules = rules.filter(
    (rule) =>
      rule.payload.toLowerCase().includes(filterText.toLowerCase()) ||
      rule.type.toLowerCase().includes(filterText.toLowerCase()) ||
      rule.proxy.toLowerCase().includes(filterText.toLowerCase())
  );

  // Filter providers
  const filteredProviders = providers.names.filter((name) =>
    name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getProxyColor = (proxy: string) => {
    if (proxy === "DIRECT") return "text-yellow-500";
    if (proxy === "REJECT") return "text-red-500";
    return "text-blue-500";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Rules
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter rules..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
          <TabsTrigger value="providers">
            Providers ({providers.names.length})
          </TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-2 mt-4">
          {filteredRules.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No rules found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredRules.map((rule) => (
                <Card key={rule.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-sm font-mono text-muted-foreground min-w-[40px]">
                        {rule.id}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">
                          {rule.payload}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                            {rule.type}
                          </span>
                          <span
                            className={`font-medium ${getProxyColor(
                              rule.proxy
                            )}`}
                          >
                            {rule.proxy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-2 mt-4">
          {providers.names.length > 0 && (
            <div className="flex justify-end mb-2">
              <Button
                onClick={handleRefreshAllProviders}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh All
              </Button>
            </div>
          )}
          {filteredProviders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No rule providers found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredProviders.map((name) => {
                const provider = providers.byName[name];
                const isRefreshingThis = refreshingProvider === name;
                const updatedDate = new Date(provider.updatedAt);
                const timeAgo = getTimeAgo(updatedDate);

                return (
                  <Card key={name} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-sm font-mono text-muted-foreground min-w-[40px]">
                          {provider.idx}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground mb-1">
                            {provider.name}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {provider.vehicleType} / {provider.behavior}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {provider.ruleCount}{" "}
                            {provider.ruleCount === 1 ? "rule" : "rules"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRefreshProvider(name)}
                              disabled={isRefreshingThis}
                            >
                              <RefreshCw
                                className={`h-3 w-3 ${
                                  isRefreshingThis ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Updated {timeAgo} ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMins > 0) return `${diffMins}m`;
  return "just now";
}
