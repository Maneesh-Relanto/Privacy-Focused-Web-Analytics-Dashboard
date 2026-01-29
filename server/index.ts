import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import websiteRoutes from "./routes/websites";
import eventsRoutes from "./routes/events";
import seedRoutes from "./routes/seed";
import { authMiddleware } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Seed routes (for development/testing)
  app.use("/api/seed", seedRoutes);

  // Authentication routes (public)
  app.use("/api/v1/auth", authRoutes);

  // Dashboard routes (protected)
  app.use("/api/v1/dashboard", dashboardRoutes);

  // Websites routes (protected)
  app.use("/api/v1/websites", websiteRoutes);

  // Events routes (public - requires valid tracking code)
  app.use("/api/v1/events", eventsRoutes);

  // Protected routes example
  app.get("/api/v1/protected", authMiddleware, (_req, res) => {
    res.json({ message: "This is a protected route" });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      error: "NOT_FOUND",
      message: "Route not found",
    });
  });

  return app;
}
