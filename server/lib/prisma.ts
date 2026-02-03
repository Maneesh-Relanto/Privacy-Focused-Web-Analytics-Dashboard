import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let prisma: any = null;

// Initialize Prisma using require (works better with tsx/esm loader)
try {
  const { PrismaClient } = require("@prisma/client");

  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
      log: ["warn", "error"],
    });
  } else {
    const globalWithPrisma = global as typeof globalThis & {
      prisma: any;
    };

    if (!globalWithPrisma.prisma) {
      globalWithPrisma.prisma = new PrismaClient();
    }

    prisma = globalWithPrisma.prisma;
  }
} catch (error) {
  console.error("Failed to initialize Prisma:", error);
  // Provide a fallback that won't crash the app
  prisma = {
    $on: () => {},
    $disconnect: async () => {},
    user: { findUnique: async () => null },
  };
}

export default prisma;
