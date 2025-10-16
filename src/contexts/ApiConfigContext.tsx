import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { setCurrentConfig } from "../api/config";
import { ApiConfigContext, STORAGE_KEY } from "./ApiConfigContext.types";
import type { ApiConfig } from "./ApiConfigContext.types";

export type { ApiConfig } from "./ApiConfigContext.types";
export { ApiConfigContext } from "./ApiConfigContext.types";

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<ApiConfig | null>(null);

  useEffect(() => {
    // Load config from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfigState(parsed);
        setCurrentConfig(parsed); // Sync with api/config.ts
      } catch (error) {
        console.error("Failed to parse stored config:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const setConfig = (newConfig: ApiConfig) => {
    setConfigState(newConfig);
    setCurrentConfig(newConfig); // Sync with api/config.ts
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  };

  const clearConfig = () => {
    setConfigState(null);
    setCurrentConfig(null); // Sync with api/config.ts
    localStorage.removeItem(STORAGE_KEY);
  };

  const testConnection = async (testConfig: ApiConfig): Promise<boolean> => {
    try {
      const url = `${testConfig.baseURL}/version`;
      const headers: HeadersInit = {};
      if (testConfig.secret) {
        headers["Authorization"] = `Bearer ${testConfig.secret}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      return response.ok;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  };

  const isConfigured = config !== null && config.baseURL !== "";

  return (
    <ApiConfigContext.Provider
      value={{
        config,
        isConfigured,
        setConfig,
        clearConfig,
        testConnection,
      }}
    >
      {children}
    </ApiConfigContext.Provider>
  );
}
