// Entry Point
import '@std/dotenv/load';
import { swaggerUI } from '@hono/swagger-ui';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userRoutes } from './features/user/presentation/routes.ts';
import { teamRoutes } from './features/team/presentation/routes.ts';
import { useDrizzlePostgres } from './middlewares/use-drizzle-postgres.ts';
import { DbConnectionOverrides } from './config/db.ts';
import { membershipRoutes } from './features/membership/presentation/routes.ts';
// import { displayRoutesTree } from './display-routes-tree.ts';
import { createOpenApiApp } from './shared/schema-validation/create-open-api-app.ts';
import { addressRoutes } from './features/address/presentation/routes.ts';

export function createApp(
  {
    seedDatabase,
    dbConnectionOverrides,
  }: {
    seedDatabase?: (db: NodePgDatabase<Record<string, never>>) => Promise<void>;
    dbConnectionOverrides?: DbConnectionOverrides;
  } = {},
) {
  const app = createOpenApiApp();

  // Setup dependencies / middlewares
  app.use(useDrizzlePostgres({ seedDatabase, dbConnectionOverrides }));

  // Setup routes
  app.route('/', userRoutes);
  app.route('/', teamRoutes);
  app.route('/', membershipRoutes);
  app.route('/', addressRoutes);

  return app;
}

if (import.meta.main) {
  const [isTestEnv, isDevelopmentEnv] = [
    Deno.env.get('NODE_ENV') === 'test',
    Deno.env.get('NODE_ENV') === 'development',
  ];

  const app = createApp();
  if (isTestEnv) {
    console.log(
      'Cannot display routes tree with a Hono Open API application currently.',
    );
    // console.log(displayRoutesTree(app));
  }

  if (isDevelopmentEnv) {
    app.get(
      '/ui',
      swaggerUI({
        url: '/doc',
      }),
    );

    app.doc('/doc', {
      info: {
        title: 'Runbook Buddy API',
        description: 'API for Runbook Buddy',
        version: '0.0.1',
      },
      openapi: '3.1.0',
    });
  }
  Deno.serve(app.fetch);
}
