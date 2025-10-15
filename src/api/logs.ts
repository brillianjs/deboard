import { buildURL, defaultAPIConfig, type APIConfig } from "./config";

export type LogLevel = "debug" | "info" | "warning" | "error" | "silent";

export type LogEntry = {
  id: string;
  type: LogLevel;
  payload: string;
  time: string;
};

type LogsManager = {
  ws: WebSocket | null;
  subscribers: Array<(log: LogEntry) => void>;
  logLevel: LogLevel;
};

const manager: LogsManager = {
  ws: null,
  subscribers: [],
  logLevel: "info",
};

function buildWebSocketURL(
  endpoint: string,
  config: APIConfig,
  logLevel: LogLevel
) {
  const url = new URL(buildURL(endpoint, config));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

  const params = new URLSearchParams();
  if (config.secret) {
    params.append("token", config.secret);
  }
  params.append("level", logLevel);

  return `${url.toString()}${params.toString() ? "?" + params.toString() : ""}`;
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const YY = d.getFullYear() % 100;
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${YY}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

function getRandomStr(): string {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
}

export function subscribeLogs(
  callback: (log: LogEntry) => void,
  logLevel: LogLevel = "info",
  config: APIConfig = defaultAPIConfig
): () => void {
  manager.subscribers.push(callback);
  manager.logLevel = logLevel;

  if (
    !manager.ws ||
    manager.ws.readyState > WebSocket.OPEN ||
    manager.logLevel !== logLevel
  ) {
    if (manager.ws) {
      manager.ws.close();
    }

    const url = buildWebSocketURL("/logs", config, logLevel);
    manager.ws = new WebSocket(url);

    manager.ws.addEventListener("error", (error) => {
      console.error("Logs WebSocket error:", error);
    });

    manager.ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        const now = new Date();
        const log: LogEntry = {
          id: `${+now}-${getRandomStr()}`,
          type: data.type,
          payload: data.payload,
          time: formatDate(now),
        };
        manager.subscribers.forEach((cb) => cb(log));
      } catch (error) {
        console.error("Failed to parse log data:", error);
      }
    });

    manager.ws.addEventListener("close", () => {
      console.log("Logs WebSocket closed");
    });
  }

  return () => {
    const index = manager.subscribers.indexOf(callback);
    if (index > -1) {
      manager.subscribers.splice(index, 1);
    }

    if (manager.subscribers.length === 0 && manager.ws) {
      manager.ws.close();
      manager.ws = null;
    }
  };
}

export function stopLogs(): void {
  if (manager.ws && manager.ws.readyState <= WebSocket.OPEN) {
    manager.ws.close();
    manager.ws = null;
  }
}

export function reconnectLogs(
  logLevel: LogLevel = "info",
  config: APIConfig = defaultAPIConfig
): void {
  stopLogs();
  if (manager.subscribers.length > 0) {
    const callback = manager.subscribers[0];
    subscribeLogs(callback, logLevel, config);
  }
}
