import { createClient } from '@libsql/client';
import { VITE_DATABASE_URL, VITE_TURSO_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';
import { EventEmitter } from "events"


const sqlite = createClient({ url: VITE_DATABASE_URL, authToken: VITE_TURSO_TOKEN });
export const db = drizzle(sqlite);

export const emitter = new EventEmitter()
