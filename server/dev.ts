import path from "path";
import { createServer } from "./index";
import * as express from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("🔧 Starting server initialization...");
console.log(`📋 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📋 PORT: ${process.env.PORT || 3000}`);
console.log(`📋 DATABASE_URL: ${process.env.DATABASE_URL}`);

let server: any = null;

async function initializeDatabase() {
  try {
    console.log("🗄️ Initializing database...");
    // For SQLite in production, use db push instead of migrate deploy
    // This creates the database and applies schema in one step
    await execAsync("npx prisma db push --skip-generate");
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.warn("⚠️ Database initialization warning:", err instanceof Error ? err.message : String(err));
    // Continue - the database might already be initialized
  }
}

async function startServer() {
  try {
    console.log("📚 Creating Express app...");
    const app = createServer();
    console.log("✅ Express app created successfully");

    // Initialize database before starting server
    await initializeDatabase();

    const port = process.env.PORT || 3000;

    console.log(`🎯 Attempting to listen on port ${port}...`);
    server = app.listen(port, () => {
      console.log(`🚀 API Server running on port ${port}`);
      console.log(`📱 Vite Frontend: http://localhost:8080`);
      console.log(`🔧 API: http://localhost:${port}/api`);
      console.log(`💡 Make sure to run 'pnpm dev' in another terminal for frontend`);
    });

    server.on("error", (err: any) => {
      console.error("❌ Server error:", err);
      process.exit(1);
    });

    console.log("✅ Server listeners configured");
  } catch (err) {
    console.error("❌ Failed to create server:", err);
    console.error(err instanceof Error ? err.stack : "No stack trace available");
    process.exit(1);
  }
}

// Start the server
(async () => {
  await startServer();
})();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
