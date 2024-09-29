import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
});
