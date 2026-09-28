import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@victoire/shared": fileURLToPath(
        new URL("./src/lib/shared.ts", import.meta.url),
      ),
      "@victoire/validation": fileURLToPath(
        new URL("./src/lib/validation.ts", import.meta.url),
      ),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: { port: 5173, host: true },
  build: { target: "es2022", sourcemap: false },
});
