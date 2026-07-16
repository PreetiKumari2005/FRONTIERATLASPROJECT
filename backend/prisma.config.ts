import "dotenv/config"; // 👈 CRITICAL: This loads your standard .env file!
import { defineConfig, env } from "prisma/config";

// ALTERNATIVE FOR CLOUDFLARE WORKERS (.dev.vars):
// If you want to load your .dev.vars instead of .env, uncomment the line below:
// import { config } from "dotenv"; config({ path: ".dev.vars" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});