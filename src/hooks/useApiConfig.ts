import { useContext } from "react";
import { ApiConfigContext } from "../contexts/ApiConfigContext.types";

export function useApiConfig() {
  const context = useContext(ApiConfigContext);
  if (context === undefined) {
    throw new Error("useApiConfig must be used within ApiConfigProvider");
  }
  return context;
}
