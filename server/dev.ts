import path from "path";
import { createServer } from "./index";
import * as express from "express";

try {
  const app = createServer();
  const port = process.env.PORT || 3000;

  // In development, let Vite handle the frontend
  // This Express server only handles API requests
  const server = app.listen(port, () => {
    console.log(`🚀 API Server running on port ${port}`);
    console.log(`📱 Vite Frontend: http://localhost:8080`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    console.log(`💡 Make sure to run 'pnpm dev' in another terminal for frontend`);
  });

  server.on("error", (err) => {
    console.error("❌ Server error:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("❌ Failed to create server:", err);
  process.exit(1);
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
