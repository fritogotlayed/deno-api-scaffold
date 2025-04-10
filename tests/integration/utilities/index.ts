import {
  DbConnectionOverrides,
  isTruthyEnvVar,
  usingDbClient,
} from '../../../src/config/db.ts';
import { createApp } from '../../../src/main.ts';

export function generateTestDbName(): string {
  const full = crypto.randomUUID().replaceAll(/-/g, '');
  return `test_${full}`;
}

async function dropDatabase(name: string): Promise<void> {
  await usingDbClient(async (client) => {
    await client.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
  });
}

async function createTestDb(
  config: DbConnectionOverrides,
): Promise<void> {
  // Work against the main database. I.e. don't provide the connection overrides.
  await usingDbClient(async (client) => {
    await client.query(`CREATE DATABASE ${config.database}`);
  });

  // Run the migrations against the test database
  const command = new Deno.Command('deno', {
    args: [
      'task',
      'tool:drizzle',
      'migrate',
    ],
    env: {
      DB_NAME: config.database ?? '',
      DB_HOST: config.host ?? '',
      DB_USER: config.user ?? '',
      DB_PASSWORD: config.password ?? '',
      DB_PORT: config.port?.toString() ?? '',
    },
  });

  const { code, stdout, stderr } = await command.output();
  if (isTruthyEnvVar('DB_LOGGING')) {
    console.log(new TextDecoder().decode(stdout));
    console.log(new TextDecoder().decode(stderr));
  }
  if (code !== 0) {
    throw new Error(`Failed to run migrations: ${code}`);
  }
}

/**
 * Create a test database and configures the app to use the test database.
 * @returns - The app instance
 */
export async function integrationTestSetup() {
  const testDbName = generateTestDbName();

  // TODO: ensure these are set when tests are run. Being lazy for noww.
  Deno.env.set('DB_HOST', 'localhost');
  Deno.env.set('DB_PORT', '5432');
  Deno.env.set('DB_USER', 'postgres');
  Deno.env.set('DB_PASSWORD', 'pwd4postgres!');
  Deno.env.set('DB_LOGGING', 'false');
  Deno.env.set('NODE_ENV', 'test');

  // We're on the default db so we can create the test db.
  await createTestDb({
    database: testDbName,
  });

  // Set the db name to the test db name so that createApp uses the test db during initialization.
  Deno.env.set('DB_NAME', testDbName);

  const app = createApp({
    dbConnectionOverrides: {
      database: testDbName,
    },
  });

  const cleanupCallback = () => {
    return integrationTestTeardown(testDbName);
  };

  return { app, cleanupCallback };
}

/**
 * Ensures that the test db is dropped after the tests are run.
 * @param testDbName
 */
async function integrationTestTeardown(testDbName: string) {
  // Ensure we are on the default db before dropping the test db
  Deno.env.set('DB_NAME', 'postgres');
  await dropDatabase(testDbName);
}
