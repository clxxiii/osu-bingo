import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_TOKEN!
	},
	schema: ['./src/lib/drizzle/schema.ts', './src/lib/drizzle/relations.ts'],
	out: './src/lib/drizzle/migrations'
});
