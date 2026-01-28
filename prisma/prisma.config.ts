import { defineConfig } from "@prisma/internals";

export default defineConfig({
  datasources: {
    db: {
      fromEnvVar: "DATABASE_URL",
    },
  },
});
