import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/brief": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/critique": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
