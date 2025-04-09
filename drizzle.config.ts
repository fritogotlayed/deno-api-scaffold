import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/db/schema.ts',
  ],
  out: './src/db/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  migrations: {
    prefix: 'timestamp',
  },
  dbCredentials: {
    host: Deno.env.get('DB_HOST') ?? 'localhost',
    database: Deno.env.get('DB_NAME') ?? 'api_scaffold',
    password: Deno.env.get('DB_PASSWORD') ?? 'pwd4postgres!',
    port: ~~(Deno.env.get('PORT') ?? 5432),
    user: Deno.env.get('DB_USER') ?? 'postgres',
    ssl: false,
  },
});
