import { buildURL, defaultAPIConfig, type APIConfig } from "./config";

type MemoryData = {
  inuse: number;
  oslimit: number;
};

type MemoryHistory = {
  labels: number[];
  memory: number[];
};

const Size = 60;

class MemoryManager {
  private ws: WebSocket | null = null;
  private data: MemoryHistory = {
    labels: Array(Size).fill(Date.now()),
    memory: Array(Size).fill(0),
  };
  private subscribers: Array<(data: MemoryData) => void> = [];

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

  appendData(memory: MemoryData) {
    this.data.memory.shift();
    this.data.labels.shift();

    const now = Date.now();
    this.data.memory.push(memory.inuse);
    this.data.labels.push(now);

    this.subscribers.forEach((callback) => callback(memory));
  }

  subscribe(callback: (data: MemoryData) => void) {
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

    const url = this.buildWebSocketURL("/memory", config);
    this.ws = new WebSocket(url);

    this.ws.addEventListener("error", (error) => {
      console.error("Memory WebSocket error:", error);
    });

    this.ws.addEventListener("message", (event) => {
      try {
        const memory = JSON.parse(event.data);
        this.appendData(memory);
      } catch (error) {
        console.error("Failed to parse memory data:", error);
      }
    });

    this.ws.addEventListener("close", () => {
      console.log("Memory WebSocket closed");
    });

    return this.data;
  }

  close() {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

export const memoryManager = new MemoryManager();
