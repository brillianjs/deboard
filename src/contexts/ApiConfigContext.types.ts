import { createContext } from "react";

export interface ApiConfig {
  baseURL: string;
  secret?: string;
}

export interface ApiConfigContextType {
  config: ApiConfig | null;
  isConfigured: boolean;
  setConfig: (config: ApiConfig) => void;
  clearConfig: () => void;
  testConnection: (config: ApiConfig) => Promise<boolean>;
}

export const ApiConfigContext = createContext<ApiConfigContextType | undefined>(
  undefined
);
export const STORAGE_KEY = "clash-api-config";
