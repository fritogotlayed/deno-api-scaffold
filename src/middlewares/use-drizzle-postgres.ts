import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Context, Next } from 'hono';
import {
  createDrizzleDbConnection,
  DbConnectionOverrides,
} from '../config/db.ts';

/**
 * A simple helper that lets consumers get the db off a context object without needing to
 * explicitly set the type themselves.
 * @param c
 */
export function getDb(
  c: Context,
): ReturnType<typeof createDrizzleDbConnection> {
  /**
   * NOTE: This is a hack to get around an issue where the build fails because a
   * types.d.ts file with the below content is not being parsed appropriately.
   *
   * import {createDrizzleDbConnection} from "../config/db.ts";
   *
   * declare module 'hono' {
   *   interface Context {
   *     db: ReturnType<typeof createDrizzleDbConnection>;
   *   }
   * }
   */

  return c.get('db');
}

/**
 * A middleware that sets up a db connection and makes it available on the context object.
 * @param seedDatabase - A function that will be called with the db connection after it has been created. This can be useful for test data seeding.
 * @param dbConnectionOverrides - An object that can be used to override the default db connection settings.
 */
export function useDrizzlePostgres({
  seedDatabase,
  dbConnectionOverrides,
}: {
  seedDatabase?: (db: NodePgDatabase<Record<string, never>>) => Promise<void>;
  dbConnectionOverrides?: DbConnectionOverrides;
} = {}) {
  const db = createDrizzleDbConnection(dbConnectionOverrides);

  // TODO: Move this inside the below function?
  void seedDatabase?.(db);

  return (async (c: Context, next: Next) => {
    // NOTE: this runs every request, keep it fast
    if (!db) {
      console.log('db is undefined');
      return c.body('Internal Server Error', 500);
    }

    c.set('db', db);
    await next();
  });
}
