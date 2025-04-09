// Drizzle Client Setup
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

function isTruthyEnvVar(key: string): boolean {
  const value = Deno.env.get(key)?.toLowerCase();

  // Check if value is one of the commonly used "truthy" string representations
  const truthyValues = ['true', 't', '1', 'y', 'yes'];
  return truthyValues.includes(value || '');
}

export function createDrizzleDbConnection({
  host,
  database,
  user,
  password,
  port,
}: {
  host?: string;
  database?: string;
  user?: string;
  password?: string;
  port?: number;
} = {}) {
  const defaults = {
    user: Deno.env.get('DB_USER'),
    host: Deno.env.get('DB_HOST'),
    database: Deno.env.get('DB_NAME'),
    password: Deno.env.get('DB_PASSWORD'),
    port: ~~(Deno.env.get('DB_PORT') || 0) || undefined,
  };

  // Take the defaults and override with user provided values where provided, undefined values are ignored
  const config = {
    host: host || defaults.host,
    database: database || defaults.database,
    user: user || defaults.user,
    password: password || defaults.password,
    port: port || defaults.port,
  };
  const pool = new Pool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port,
  });

  // TODO: Pipe logger to another framework like bunyan or pino. https://orm.drizzle.team/docs/goodies#logging
  return drizzle(pool, { logger: isTruthyEnvVar('DB_LOGGING') });
}
export const db = createDrizzleDbConnection();
