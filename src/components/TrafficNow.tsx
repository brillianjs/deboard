import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { trafficManager, connectionsManager } from "@/api/traffic";
import { formatSpeed, formatBytes } from "@/lib/format";

interface TrafficStats {
  upload: string;
  download: string;
  uploadTotal: string;
  downloadTotal: string;
}

export default function TrafficNow() {
  const [stats, setStats] = useState<TrafficStats>({
    upload: "0 B/s",
    download: "0 B/s",
    uploadTotal: "0 B",
    downloadTotal: "0 B",
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
      }));
    });

    // Fetch initial data
    trafficManager.fetchData();
    connectionsManager.fetchData();

    return () => {
      unsubscribeTraffic();
      unsubscribeConnections();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
    </div>
  );
}
