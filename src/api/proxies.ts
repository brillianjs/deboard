import { buildURL, getHeaders, defaultAPIConfig } from "./config";
import type { APIConfig } from "./config";

export interface Proxy {
  name: string;
  type: string;
  udp: boolean;
  now?: string;
  history: Array<{ time: string; delay: number }>;
  all?: string[];
}

export interface ProxyGroup {
  name: string;
  type: string;
  now: string;
  all: string[];
  history: Array<{ time: string; delay: number }>;
  udp?: boolean;
}

export interface ProxiesResponse {
  proxies: Record<string, Proxy | ProxyGroup>;
}

// Fetch all proxies
export async function fetchProxies(
  config: APIConfig = defaultAPIConfig
): Promise<ProxiesResponse> {
  const url = buildURL("/proxies", config);
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch proxies: ${response.statusText}`);
  }

  return await response.json();
}

// Switch proxy in a group
export async function switchProxy(
  groupName: string,
  proxyName: string,
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL(`/proxies/${encodeURIComponent(groupName)}`, config);
  const response = await fetch(url, {
    method: "PUT",
    headers: getHeaders(config),
    body: JSON.stringify({ name: proxyName }),
  });

  if (!response.ok) {
    throw new Error(`Failed to switch proxy: ${response.statusText}`);
  }
}

// Test proxy delay
export async function testProxyDelay(
  proxyName: string,
  testUrl: string = "http://www.gstatic.com/generate_204",
  timeout: number = 5000,
  config: APIConfig = defaultAPIConfig
): Promise<{ delay: number }> {
  const url = buildURL(
    `/proxies/${encodeURIComponent(
      proxyName
    )}/delay?timeout=${timeout}&url=${encodeURIComponent(testUrl)}`,
    config
  );
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to test proxy delay: ${response.statusText}`);
  }

  return await response.json();
}
