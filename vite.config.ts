import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Custom domain uses root path
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
