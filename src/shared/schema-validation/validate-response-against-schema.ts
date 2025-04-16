import { z } from 'zod';

const nodeEnv = Deno.env.get('NODE_ENV')?.toLowerCase().trim();
const [isDevelopment, isTest] = [
  nodeEnv === 'development',
  nodeEnv === 'test',
];

/**
 * Validates a response against a schema.
 * @param schema - The schema to validate the response against.
 * @param result - The response to validate.
 * @returns The validated response.
 * @throws If the response does not match the schema.
 *
 * @remarks
 * This function is used to validate responses against a schema. When NOTE_ENV
 * is set to 'development' or 'test', the function will log the response and
 * the schema to the console. If the response does not match the schema, the
 * function will throw an error. When the NOTE_ENV is not set to 'development'
 * or 'test', the function will bypass validation and return the response so
 * minimal overhead is incurred.
 */
export function validateResponseAgainstSchema<T>(
  schema: z.ZodSchema,
  result: T,
) {
  if (isDevelopment || isTest) {
    const parsed = schema.safeParse(result);
    if (!parsed.success) {
      if (isDevelopment) {
        console.log('----- WARNING -----');
        console.log('Response validation failed');
        console.dir({ issues: parsed.error.issues, data: result }, {
          depth: null,
        });
        console.log('----- WARNING -----');
      } else {
        throw new Error(`Response validation failed`, { cause: parsed.error });
      }
    }
  }

  return result;
}
