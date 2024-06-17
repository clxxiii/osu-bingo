import { createClient } from '@libsql/client';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';

const sqlite = createClient({ url: DATABASE_URL });
export const db = drizzle(sqlite);
