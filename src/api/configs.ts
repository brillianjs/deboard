import {
  buildURL,
  defaultAPIConfig,
  getHeaders,
  type APIConfig,
} from "./config";

export type ClashConfig = {
  port: number;
  "socks-port": number;
  "redir-port": number;
  "tproxy-port": number;
  "mixed-port": number;
  "allow-lan": boolean;
  "bind-address": string;
  mode: "Rule" | "Global" | "Direct";
  "log-level": "debug" | "info" | "warning" | "error" | "silent";
  ipv6: boolean;
  "external-controller": string;
  secret: string;
};

// Fetch configs
export async function fetchConfigs(
  config: APIConfig = defaultAPIConfig
): Promise<ClashConfig> {
  const url = buildURL("/configs", config);
  const response = await fetch(url, {
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch configs: ${response.statusText}`);
  }

  return await response.json();
}

// Update configs
export async function updateConfigs(
  updates: Partial<ClashConfig>,
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL("/configs", config);

  // Backward compatibility for older clash using `socket-port`
  const body: Record<string, unknown> = { ...updates };
  if ("socks-port" in updates) {
    body["socket-port"] = updates["socks-port"];
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers: getHeaders(config),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update configs: ${response.statusText}`);
  }
}

// Reload configs
export async function reloadConfigs(
  configPath: string,
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL("/configs", config);
  const response = await fetch(url, {
    method: "PUT",
    headers: getHeaders(config),
    body: JSON.stringify({ path: configPath }),
  });

  if (!response.ok) {
    throw new Error(`Failed to reload configs: ${response.statusText}`);
  }
}

// Get version
export async function getVersion(
  config: APIConfig = defaultAPIConfig
): Promise<{ version: string; premium?: boolean; meta?: boolean }> {
  const url = buildURL("/version", config);
  const response = await fetch(url, {
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to get version: ${response.statusText}`);
  }

  return await response.json();
}

// Restart core
export async function restartCore(
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL("/restart", config);
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to restart core: ${response.statusText}`);
  }
}

// Upgrade core
export async function upgradeCore(
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL("/upgrade", config);
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to upgrade core: ${response.statusText}`);
  }
}

// Upgrade UI
export async function upgradeUI(
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  const url = buildURL("/upgrade/ui", config);
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to upgrade UI: ${response.statusText}`);
  }
}
