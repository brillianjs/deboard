import { Card, CardContent } from "@/components/ui/card";

interface TrafficStats {
  upload: string;
  download: string;
  uploadTotal: string;
  downloadTotal: string;
  activeConnections: number;
}

export default function TrafficNow() {
  // Mock data - replace with real API data
  const stats: TrafficStats = {
    upload: "0 B/s",
    download: "0 B/s",
    uploadTotal: "0 B",
    downloadTotal: "0 B",
    activeConnections: 0,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {stats.activeConnections}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
