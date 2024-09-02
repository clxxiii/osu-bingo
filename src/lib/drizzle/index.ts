import { createClient } from '@libsql/client';
import { TURSO_TOKEN, TURSO_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';


const sqlite = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
export const db = drizzle(sqlite);

