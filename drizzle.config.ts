import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL,
    authToken: process.env.VITE_TURSO_TOKEN
  },
  schema: ['./src/lib/drizzle/schema.ts', './src/lib/drizzle/relations.ts'],
  out: './src/lib/drizzle/migrations'
});
