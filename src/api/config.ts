// API Configuration
export const API_BASE_URL = "http://192.168.250.36:9090";
export const API_SECRET = ""; // Add secret if needed

export interface APIConfig {
  baseURL: string;
  secret?: string;
}

export const defaultAPIConfig: APIConfig = {
  baseURL: API_BASE_URL,
  secret: API_SECRET,
};

// Helper to get headers
export function getHeaders(config: APIConfig = defaultAPIConfig) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.secret) {
    headers["Authorization"] = `Bearer ${config.secret}`;
  }

  return headers;
}

// Helper to build URL
export function buildURL(
  endpoint: string,
  config: APIConfig = defaultAPIConfig
) {
  return `${config.baseURL}${endpoint}`;
}
