import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Only use Express middleware in dev mode
  const plugins = [react()];

  if (mode === "development") {
    plugins.push(expressDevPlugin());
  }

  return {
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: [".", "./client", "./shared"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
      middlewareMode: mode === "development",
    },
    build: {
      outDir: "dist/spa",
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../client"),
        "@shared": path.resolve(__dirname, "../shared"),
      },
    },
  };
});

function expressDevPlugin() {
  return {
    name: "express-dev-plugin",
    apply: "serve",
    async configureServer(server) {
      // Only load Express during development
      const { createServer } = await import("../server/index.ts");
      const app = createServer();

      // Return middleware function
      return () => {
        server.middlewares.use(app);
      };
    },
  };
}
