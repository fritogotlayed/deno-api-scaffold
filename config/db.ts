// Drizzle Client Setup
import { drizzle } from '../deps.ts';
import { Database } from 'https://deno.land/x/sqlite3@0.9.1/mod.ts';

const sqlite = new Database(':memory:');
export const db = drizzle(sqlite);
