import { buildURL, defaultAPIConfig, getHeaders, type APIConfig } from "./config";

export type Rule = {
  id: number;
  type: string;
  payload: string;
  proxy: string;
};

export type RuleProvider = {
  idx: number;
  name: string;
  behavior: string;
  ruleCount: number;
  type: string;
  updatedAt: string;
  vehicleType: "HTTP" | "File";
};

type RulesResponse = {
  rules: Array<{
    type: string;
    payload: string;
    proxy: string;
  }>;
};

type RuleProvidersResponse = {
  providers: Record<string, Omit<RuleProvider, "idx" | "name">>;
};

// Fetch rules
export async function fetchRules(
  config: APIConfig = defaultAPIConfig
): Promise<Rule[]> {
  try {
    const url = buildURL("/rules", config);
    const response = await fetch(url, {
      headers: getHeaders(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.statusText}`);
    }

    const data: RulesResponse = await response.json();
    return data.rules.map((rule, index) => ({
      ...rule,
      id: index,
    }));
  } catch (error) {
    console.error("Error fetching rules:", error);
    return [];
  }
}

// Fetch rule providers
export async function fetchRuleProviders(
  config: APIConfig = defaultAPIConfig
): Promise<{ byName: Record<string, RuleProvider>; names: string[] }> {
  try {
    const url = buildURL("/providers/rules", config);
    const response = await fetch(url, {
      headers: getHeaders(config),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch rule providers: ${response.statusText}`
      );
    }

    const data: RuleProvidersResponse = await response.json();
    const names = Object.keys(data.providers);
    const byName: Record<string, RuleProvider> = {};

    names.forEach((name, index) => {
      byName[name] = {
        ...data.providers[name],
        name,
        idx: index,
      };
    });

    return { byName, names };
  } catch (error) {
    console.error("Error fetching rule providers:", error);
    return { byName: {}, names: [] };
  }
}

// Update rule provider
export async function updateRuleProvider(
  name: string,
  config: APIConfig = defaultAPIConfig
): Promise<boolean> {
  try {
    const url = buildURL(`/providers/rules/${name}`, config);
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(config),
    });

    return response.ok;
  } catch (error) {
    console.error(`Error updating rule provider ${name}:`, error);
    return false;
  }
}

// Update all rule providers
export async function updateAllRuleProviders(
  names: string[],
  config: APIConfig = defaultAPIConfig
): Promise<void> {
  for (const name of names) {
    await updateRuleProvider(name, config);
  }
}
