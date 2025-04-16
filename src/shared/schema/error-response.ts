import { z } from 'zod';

export const MessageErrorResponseSchema = z.object({
  message: z.string(),
});

export const SchemaValidationErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    issues: z.array(z.object({
      code: z.string(),
      expected: z.string(),
      received: z.string(),
      path: z.array(z.string()),
      message: z.string(),
    })),
    name: z.string(),
  }),
});

export const ErrorResponseSchema = z.union([
  MessageErrorResponseSchema,
  SchemaValidationErrorResponseSchema,
]);
