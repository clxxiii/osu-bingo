import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const sqlite = createClient({ url: env.TURSO_URL, authToken: env.TURSO_TOKEN });
export const db = drizzle(sqlite);

