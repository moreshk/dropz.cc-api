import process from 'node:process';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema',
  out: './src/schema/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
