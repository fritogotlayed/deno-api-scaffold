// Entry Point
import 'jsr:@std/dotenv/load';
import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userRoutes } from './features/user/routes.ts';
import { teamRoutes } from './features/team/routes.ts';
import { useDrizzlePostgres } from './middlewares/use-drizzle-postgres.ts';
import { DbConnectionOverrides } from './config/db.ts';

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
  app.route('/users', userRoutes);
  app.route('/teams', teamRoutes);

  return app;
}

if (import.meta.main) {
  const app = createApp();
  console.log(showRoutes(app));
  Deno.serve(app.fetch);
}
