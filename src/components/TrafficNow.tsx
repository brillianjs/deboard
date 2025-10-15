import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { trafficManager, connectionsManager } from "@/api/traffic";
import { memoryManager } from "@/api/memory";
import { formatSpeed, formatBytes } from "@/lib/format";

interface TrafficStats {
  upload: string;
  download: string;
  uploadTotal: string;
  downloadTotal: string;
  activeConnections: number;
  memoryUsage: string;
  memoryPercent: string;
}

export default function TrafficNow() {
  const [stats, setStats] = useState<TrafficStats>({
    upload: "0 B/s",
    download: "0 B/s",
    uploadTotal: "0 B",
    downloadTotal: "0 B",
    activeConnections: 0,
    memoryUsage: "0 B",
    memoryPercent: "0",
  });

  useEffect(() => {
    // Subscribe to traffic updates
    const unsubscribeTraffic = trafficManager.subscribe((traffic) => {
      setStats((prev) => ({
        ...prev,
        upload: formatSpeed(traffic.up),
        download: formatSpeed(traffic.down),
      }));
    });

    // Subscribe to connections updates
    const unsubscribeConnections = connectionsManager.subscribe((data) => {
      setStats((prev) => ({
        ...prev,
        uploadTotal: formatBytes(data.uploadTotal),
        downloadTotal: formatBytes(data.downloadTotal),
        activeConnections: data.connections.length,
      }));
    });

    // Subscribe to memory updates
    const unsubscribeMemory = memoryManager.subscribe((data) => {
      const usagePercent =
        data.oslimit > 0 ? ((data.inuse / data.oslimit) * 100).toFixed(1) : "0";
      setStats((prev) => ({
        ...prev,
        memoryUsage: formatBytes(data.inuse),
        memoryPercent: usagePercent,
      }));
    });

    // Fetch initial data
    trafficManager.fetchData();
    connectionsManager.fetchData();
    memoryManager.fetchData();

    return () => {
      unsubscribeTraffic();
      unsubscribeConnections();
      unsubscribeMemory();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Upload</div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {stats.upload}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Download</div>
          <div className="text-xl sm:text-2xl font-bold text-secondary">
            {stats.download}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Upload Total</div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {stats.uploadTotal}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">
            Download Total
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {stats.downloadTotal}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">
            Active Connections
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-500">
            {stats.activeConnections}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Memory Usage</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-500">
            {stats.memoryUsage}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.memoryPercent}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
