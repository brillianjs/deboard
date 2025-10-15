import {
  buildURL,
  defaultAPIConfig,
  getHeaders,
  type APIConfig,
} from "./config";

export type Connection = {
  id: string;
  metadata: {
    network: string;
    type: string;
    sourceIP: string;
    destinationIP: string;
    sourcePort: string;
    destinationPort: string;
    host: string;
    processPath?: string;
  };
  upload: number;
  download: number;
  start: string;
  chains: string[];
  rule: string;
  rulePayload?: string;
};

export type ConnectionsData = {
  downloadTotal: number;
  uploadTotal: number;
  connections: Connection[];
};

type ConnectionsManager = {
  ws: WebSocket | null;
  subscribers: Array<(data: ConnectionsData) => void>;
};

const manager: ConnectionsManager = {
  ws: null,
  subscribers: [],
};

function buildWebSocketURL(endpoint: string, config: APIConfig) {
  const url = new URL(buildURL(endpoint, config));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

  const params = new URLSearchParams();
  if (config.secret) {
    params.append("token", config.secret);
  }

  return `${url.toString()}${params.toString() ? "?" + params.toString() : ""}`;
}

export function subscribeConnections(
  callback: (data: ConnectionsData) => void,
  config: APIConfig = defaultAPIConfig
): () => void {
  manager.subscribers.push(callback);

  if (!manager.ws || manager.ws.readyState > WebSocket.OPEN) {
    const url = buildWebSocketURL("/connections", config);
    manager.ws = new WebSocket(url);

    manager.ws.addEventListener("error", (error) => {
      console.error("Connections WebSocket error:", error);
    });

    manager.ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        manager.subscribers.forEach((cb) => cb(data));
      } catch (error) {
        console.error("Failed to parse connections data:", error);
      }
    });

    manager.ws.addEventListener("close", () => {
      console.log("Connections WebSocket closed");
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

// Close all connections
export async function closeAllConnections(
  config: APIConfig = defaultAPIConfig
): Promise<boolean> {
  try {
    const url = buildURL("/connections", config);
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(config),
    });

    return response.ok;
  } catch (error) {
    console.error("Error closing all connections:", error);
    return false;
  }
}

// Close connection by ID
export async function closeConnection(
  id: string,
  config: APIConfig = defaultAPIConfig
): Promise<boolean> {
  try {
    const url = buildURL(`/connections/${id}`, config);
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(config),
    });

    return response.ok;
  } catch (error) {
    console.error(`Error closing connection ${id}:`, error);
    return false;
  }
}
