import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

export let db: LibSQLDatabase<Record<string, never>>;

if (env.TURSO_URL) {
	const sqlite = createClient({ url: env.TURSO_URL, authToken: env.TURSO_TOKEN });
	db = drizzle(sqlite);
}
