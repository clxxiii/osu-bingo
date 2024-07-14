import { createClient } from '@libsql/client';
import { DATABASE_URL, TURSO_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';
import { EventEmitter } from "events"


const sqlite = createClient({ url: DATABASE_URL, authToken: TURSO_TOKEN });
export const db = drizzle(sqlite);

export const emitter = new EventEmitter()
