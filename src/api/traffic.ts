import { buildURL, defaultAPIConfig, type APIConfig } from "./config";

const TRAFFIC_ENDPOINT = "/traffic";
const CONNECTIONS_ENDPOINT = "/connections";

type Traffic = { up: number; down: number };
type TrafficData = {
  labels: number[];
  up: number[];
  down: number[];
};

type Connection = {
  id: string;
  metadata: {
    network: string;
    type: string;
    sourceIP: string;
    destinationIP: string;
    sourcePort: string;
    destinationPort: string;
    host: string;
  };
  upload: number;
  download: number;
  start: string;
  chains: string[];
  rule: string;
};

type ConnectionsData = {
  downloadTotal: number;
  uploadTotal: number;
  connections: Connection[];
};

const Size = 60;

class TrafficManager {
  private ws: WebSocket | null = null;
  private data: TrafficData = {
    labels: Array(Size).fill(Date.now()),
    up: Array(Size).fill(0),
    down: Array(Size).fill(0),
  };
  private subscribers: Array<(data: Traffic) => void> = [];

  private buildWebSocketURL(endpoint: string, config: APIConfig) {
    const url = new URL(buildURL(endpoint, config));
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

    const params = new URLSearchParams();
    if (config.secret) {
      params.append("token", config.secret);
    }

    return `${url.toString()}${
      params.toString() ? "?" + params.toString() : ""
    }`;
  }

  appendData(traffic: Traffic) {
    this.data.up.shift();
    this.data.down.shift();
    this.data.labels.shift();

    const now = Date.now();
    this.data.up.push(traffic.up);
    this.data.down.push(traffic.down);
    this.data.labels.push(now);

    this.subscribers.forEach((callback) => callback(traffic));
  }

  subscribe(callback: (data: Traffic) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  fetchData(config: APIConfig = defaultAPIConfig) {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      return this.data;
    }

    const url = this.buildWebSocketURL(TRAFFIC_ENDPOINT, config);
    this.ws = new WebSocket(url);

    this.ws.addEventListener("error", (error) => {
      console.error("Traffic WebSocket error:", error);
    });

    this.ws.addEventListener("message", (event) => {
      try {
        const traffic = JSON.parse(event.data);
        this.appendData(traffic);
      } catch (error) {
        console.error("Failed to parse traffic data:", error);
      }
    });

    this.ws.addEventListener("close", () => {
      console.log("Traffic WebSocket closed");
    });

    return this.data;
  }

  close() {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

class ConnectionsManager {
  private ws: WebSocket | null = null;
  private subscribers: Array<(data: ConnectionsData) => void> = [];

  private buildWebSocketURL(endpoint: string, config: APIConfig) {
    const url = new URL(buildURL(endpoint, config));
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

    const params = new URLSearchParams();
    if (config.secret) {
      params.append("token", config.secret);
    }

    return `${url.toString()}${
      params.toString() ? "?" + params.toString() : ""
    }`;
  }

  subscribe(callback: (data: ConnectionsData) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  fetchData(config: APIConfig = defaultAPIConfig) {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      return;
    }

    const url = this.buildWebSocketURL(CONNECTIONS_ENDPOINT, config);
    this.ws = new WebSocket(url);

    this.ws.addEventListener("error", (error) => {
      console.error("Connections WebSocket error:", error);
    });

    this.ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.subscribers.forEach((callback) => callback(data));
      } catch (error) {
        console.error("Failed to parse connections data:", error);
      }
    });

    this.ws.addEventListener("close", () => {
      console.log("Connections WebSocket closed");
    });
  }

  close() {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

export const trafficManager = new TrafficManager();
export const connectionsManager = new ConnectionsManager();
