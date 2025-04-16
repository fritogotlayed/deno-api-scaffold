import { OpenAPIHono, OpenAPIHonoOptions } from '@hono/zod-openapi';
import { Env } from 'hono';

export function createOpenApiApp<T extends Env>(init?: OpenAPIHonoOptions<T>) {
  return new OpenAPIHono<T>(init);
}
