import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

const getPrismaClient = (): PrismaClient => {
  if (prisma) return prisma;

  prisma = new PrismaClient(
    process.env.NODE_ENV === "production"
      ? {
          log: ["warn", "error"],
        }
      : undefined
  );

  // Handle graceful shutdown
  if (typeof global !== "undefined") {
    const globalWithPrisma = global as typeof globalThis & {
      prismaClient?: PrismaClient;
    };
    globalWithPrisma.prismaClient = prisma;
  }

  return prisma;
};

// Initialize immediately to ensure client is ready
const client = getPrismaClient();

export default client;
