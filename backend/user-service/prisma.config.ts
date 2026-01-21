import 'dotenv/config'; // MUST be first
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  // In 2026, it is recommended to explicitly set the engine to 'classic' 
  // if you encounter WASM-related module errors
  engine: 'classic', 
});
