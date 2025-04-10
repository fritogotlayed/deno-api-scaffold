// Drizzle Client Setup
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

export type DbConnectionOverrides = {
  host?: string;
  database?: string;
  user?: string;
  password?: string;
  port?: number;
};

export function isTruthyEnvVar(key: string): boolean {
  const value = Deno.env.get(key)?.toLowerCase();

  // Check if value is one of the commonly used "truthy" string representations
  const truthyValues = ['true', 't', '1', 'y', 'yes'];
  return truthyValues.includes(value || '');
}

function createPool({
  host,
  database,
  user,
  password,
  port,
}: DbConnectionOverrides) {
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
  return new Pool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port,
  });
}

export async function usingDbClient(
  callback: (client: pg.PoolClient) => Promise<void>,
  config: DbConnectionOverrides = {},
) {
  const pool = createPool(config);
  const client = await pool.connect();
  try {
    await callback(client);
  } finally {
    client.release();
    await pool.end();
  }
}

export function createDrizzleDbConnection(config: DbConnectionOverrides = {}) {
  const pool = createPool(config);

  // TODO: Pipe logger to another framework like bunyan or pino. https://orm.drizzle.team/docs/goodies#logging
  return drizzle(pool, { logger: isTruthyEnvVar('DB_LOGGING') });
}
