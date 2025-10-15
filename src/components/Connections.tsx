import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Trash2, Play, Pause, ChevronDown } from "lucide-react";
import {
  subscribeConnections,
  closeAllConnections,
  closeConnection,
  type ConnectionsData,
} from "@/api/connections";
import { formatBytes } from "@/lib/format";

const ITEMS_PER_PAGE = 20;

export default function Connections() {
  const [connectionsData, setConnectionsData] = useState<ConnectionsData>({
    downloadTotal: 0,
    uploadTotal: 0,
    connections: [],
  });
  const [filterText, setFilterText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showCloseAll, setShowCloseAll] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (isPaused) return;

    const unsubscribe = subscribeConnections((data) => {
      setConnectionsData(data);
    });

    return unsubscribe;
  }, [isPaused]);

  const handleCloseConnection = async (id: string) => {
    try {
      await closeConnection(id);
      toast.success("Connection closed");
    } catch {
      toast.error("Failed to close connection");
    }
  };

  const handleCloseAll = async () => {
    try {
      const success = await closeAllConnections();
      if (success) {
        setShowCloseAll(false);
        toast.success("All connections closed");
      }
    } catch {
      toast.error("Failed to close all connections");
    }
  };

  const filteredConnections = connectionsData.connections.filter((conn) => {
    const searchText = filterText.toLowerCase();
    return (
      conn.metadata.host.toLowerCase().includes(searchText) ||
      conn.metadata.sourceIP.toLowerCase().includes(searchText) ||
      conn.metadata.destinationIP.toLowerCase().includes(searchText) ||
      conn.chains.join(" ").toLowerCase().includes(searchText) ||
      conn.rule.toLowerCase().includes(searchText)
    );
  });

  // Reset display count when filter changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filterText]);

  const displayedConnections = filteredConnections.slice(0, displayCount);
  const hasMore = filteredConnections.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const formatDuration = (start: string) => {
    const now = Date.now();
    const startTime = new Date(start).getTime();
    const duration = now - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Connections
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>
          {connectionsData.connections.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowCloseAll(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Close All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Active</div>
            <div className="text-2xl font-bold text-foreground">
              {connectionsData.connections.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Upload</div>
            <div className="text-2xl font-bold text-primary">
              {formatBytes(connectionsData.uploadTotal)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Download</div>
            <div className="text-2xl font-bold text-secondary">
              {formatBytes(connectionsData.downloadTotal)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter connections..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Connections List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {filteredConnections.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {filterText ? "No matching connections" : "No active connections"}
            </CardContent>
          </Card>
        ) : (
          <>
            {displayedConnections.map((conn) => (
              <Card key={conn.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">
                          {conn.metadata.host || conn.metadata.destinationIP}
                        </span>
                        <Badge variant="outline">{conn.metadata.network}</Badge>
                        <Badge variant="outline">{conn.metadata.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          {conn.metadata.sourceIP}:{conn.metadata.sourcePort} →{" "}
                          {conn.metadata.destinationIP}:
                          {conn.metadata.destinationPort}
                        </div>
                        <div>Chain: {conn.chains.reverse().join(" → ")}</div>
                        <div>Rule: {conn.rule}</div>
                        <div className="flex items-center gap-4">
                          <span>↑ {formatBytes(conn.upload)}</span>
                          <span>↓ {formatBytes(conn.download)}</span>
                          <span>Duration: {formatDuration(conn.start)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCloseConnection(conn.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="w-full max-w-md"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Load More ({displayCount} of {filteredConnections.length})
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Close All Modal */}
      {showCloseAll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                Close All Connections
              </h2>
              <p className="text-muted-foreground">
                Are you sure you want to close all{" "}
                {connectionsData.connections.length} active connections?
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCloseAll(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleCloseAll}>
                  Close All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
