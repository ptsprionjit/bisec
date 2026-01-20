import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load .env files based on mode (e.g., .env.development, .env.production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [react()],
    root: ".", // project root (ensure index.html is here)
    build: {
      outDir: "build", // match CRA convention
    },
    server: {
      host: env.VITE_DEV_HOST,
      port: Number(env.VITE_DEV_PORT),
      https: {
        key: fs.readFileSync(path.resolve(env.VITE_SSL_KEY_FILE)),
        cert: fs.readFileSync(path.resolve(env.VITE_SSL_CRT_FILE)),
      },
      open: true, // optional: set true to auto-open browser
    },
  };
});
