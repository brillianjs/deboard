import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, Search } from "lucide-react";
import {
  subscribeLogs,
  stopLogs,
  reconnectLogs,
  type LogEntry,
  type LogLevel,
} from "@/api/logs";

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "bg-green-700",
  info: "bg-blue-700",
  warning: "bg-yellow-700",
  error: "bg-red-700",
  silent: "bg-gray-700",
};

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [logLevel, setLogLevel] = useState<LogLevel>("info");
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const unsubscribe = subscribeLogs((log) => {
      setLogs((prev) => [...prev, log]);
    }, logLevel);

    return unsubscribe;
  }, [isPaused, logLevel]);

  useEffect(() => {
    if (!isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isPaused]);

  const handleTogglePause = () => {
    if (isPaused) {
      reconnectLogs(logLevel);
    } else {
      stopLogs();
    }
    setIsPaused(!isPaused);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.payload.toLowerCase().includes(filterText.toLowerCase()) ||
      log.type.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Logs
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleTogglePause}>
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
          <Button variant="outline" size="sm" onClick={handleClearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Log Level Filter */}
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-sm text-muted-foreground">Level:</span>
        {(["debug", "info", "warning", "error", "silent"] as LogLevel[]).map(
          (level) => (
            <Button
              key={level}
              variant={logLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLogLevel(level);
                if (!isPaused) {
                  stopLogs();
                  subscribeLogs(
                    (log) => setLogs((prev) => [...prev, log]),
                    level
                  );
                }
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter logs..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Logs Display */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No logs to display
              </div>
            ) : (
              <div className="space-y-0">
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={`p-3 font-mono text-sm border-b border-border/50 ${
                      index % 2 === 0 ? "bg-card" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {log.time}
                      </span>
                      <Badge
                        className={`${
                          LOG_COLORS[log.type]
                        } text-white text-xs px-2`}
                      >
                        {log.type}
                      </Badge>
                      <span className="flex-1 break-all text-foreground">
                        {log.payload}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Total logs: {logs.length} | Filtered: {filteredLogs.length}
      </div>
    </div>
  );
}
