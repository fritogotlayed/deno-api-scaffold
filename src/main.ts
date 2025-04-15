// Entry Point
import 'jsr:@std/dotenv/load';
import { Hono } from 'hono';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userRoutes } from './features/user/routes.ts';
import { teamRoutes } from './features/team/routes.ts';
import { useDrizzlePostgres } from './middlewares/use-drizzle-postgres.ts';
import { DbConnectionOverrides } from './config/db.ts';
import { membershipRoutes } from './features/membership/routes.ts';
import { displayRoutesTree } from './display-routes-tree.ts';

export function createApp(
  {
    seedDatabase,
    dbConnectionOverrides,
  }: {
    seedDatabase?: (db: NodePgDatabase<Record<string, never>>) => Promise<void>;
    dbConnectionOverrides?: DbConnectionOverrides;
  } = {},
) {
  const app = new Hono();

  // Setup dependencies / middlewares
  app.use(useDrizzlePostgres({ seedDatabase, dbConnectionOverrides }));

  // Setup routes
  app.route('/', userRoutes);
  app.route('/', teamRoutes);
  app.route('/', membershipRoutes);

  return app;
}

if (import.meta.main) {
  const app = createApp();
  console.log(displayRoutesTree(app));
  Deno.serve(app.fetch);
}
