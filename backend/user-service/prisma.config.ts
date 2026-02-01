// Replace: import "dotenv/config";
// With this:
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Explicitly looks in current folder

// Add this DEBUG line to prove if it works:
console.log("DEBUG: Loading DB URL:", process.env.DATABASE_URL ? "Found it!" : "UNDEFINED");

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
  // In 2026, it is recommended to explicitly set the engine to 'classic' 
  // if you encounter WASM-related module errors
  engine: 'classic',
});
