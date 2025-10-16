// API Configuration
// Dynamic configuration - will be set from ApiConfigContext
let currentConfig: APIConfig | null = null;

export interface APIConfig {
  baseURL: string;
  secret?: string;
}

// Set current config (called by context)
export function setCurrentConfig(config: APIConfig | null) {
  currentConfig = config;
}

// Get current config
export function getCurrentConfig(): APIConfig {
  if (!currentConfig) {
    // Fallback to localStorage if context not available
    const stored = localStorage.getItem("clash-api-config");
    if (stored) {
      try {
        currentConfig = JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse stored config:", error);
      }
    }
  }

  if (!currentConfig) {
    throw new Error("API configuration not set. Please login first.");
  }

  return currentConfig;
}

export const defaultAPIConfig: APIConfig = {
  baseURL: "http://127.0.0.1:9090",
  secret: "",
};

// Helper to get headers
export function getHeaders(config?: APIConfig) {
  const apiConfig = config || getCurrentConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiConfig.secret) {
    headers["Authorization"] = `Bearer ${apiConfig.secret}`;
  }

  return headers;
}

// Helper to build URL
export function buildURL(endpoint: string, config?: APIConfig) {
  const apiConfig = config || getCurrentConfig();
  return `${apiConfig.baseURL}${endpoint}`;
}
