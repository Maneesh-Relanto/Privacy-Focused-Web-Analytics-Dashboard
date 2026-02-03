import path from "path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In development, let Vite handle the frontend
// This Express server only handles API requests
app.listen(port, () => {
  console.log(`🚀 API Server running on port ${port}`);
  console.log(`📱 Vite Frontend: http://localhost:8080`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`💡 Make sure to run 'pnpm dev' in another terminal for frontend`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
