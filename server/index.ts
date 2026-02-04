import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import websiteRoutes from "./routes/websites";
import eventsRoutes from "./routes/events";
import seedRoutes from "./routes/seed";
import trackingRoutes from "./routes/tracking";
import { authMiddleware } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware - CORS configuration for credentials support
  app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

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

  // Tracking routes (public - no auth required, validates tracking code)
  app.use("/api/v1/track", trackingRoutes);

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
